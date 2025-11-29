import { supabase } from './supabase'
import { Post, PostComment, PostLike, PostShare } from '@/types'

export class PostService {
  // Get all posts (public feed)
  static async getPosts(userId?: string, limit = 20, offset = 0): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Get posts by group
  static async getGroupPosts(groupId: string, limit = 20, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('group_id', groupId)
      .eq('is_active', true)
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  }

  // Get posts by event
  static async getEventPosts(eventId: string, limit = 20, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('event_id', eventId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  }

  // Get post by ID
  static async getPost(postId: string): Promise<Post | null> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('id', postId)
      .single()

    if (error) throw error
    return data
  }

  // Create a new post
  static async createPost(postData: Omit<Post, 'id' | 'created_at' | 'updated_at' | 'likes_count' | 'comments_count' | 'shares_count'>): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Update post
  static async updatePost(postId: string, updates: Partial<Post>): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete post (soft delete)
  static async deletePost(postId: string): Promise<void> {
    const { error } = await supabase
      .from('posts')
      .update({ is_active: false })
      .eq('id', postId)

    if (error) throw error
  }

  // Like/Unlike post
  static async toggleLike(postId: string, userId: string): Promise<boolean> {
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id)

      if (error) throw error
      await this.updateLikeCount(postId)
      return false
    } else {
      // Like
      const { error } = await supabase
        .from('post_likes')
        .insert([{
          post_id: postId,
          user_id: userId
        }])

      if (error) throw error
      await this.updateLikeCount(postId)
      return true
    }
  }

  // Check if user liked post
  static async isLiked(postId: string, userId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single()

    return !error && !!data
  }

  // Share post
  static async sharePost(postId: string, userId: string, message?: string): Promise<void> {
    const { error } = await supabase
      .from('post_shares')
      .insert([{
        post_id: postId,
        user_id: userId,
        message
      }])

    if (error) throw error
    await this.updateShareCount(postId)
  }

  // Add comment to post
  static async addComment(postId: string, userId: string, content: string, parentId?: string): Promise<PostComment> {
    const { data, error } = await supabase
      .from('post_comments')
      .insert([{
        post_id: postId,
        author_id: userId,
        content,
        parent_id: parentId
      }])
      .select()
      .single()

    if (error) throw error
    await this.updateCommentCount(postId)
    return data
  }

  // Get post comments
  static async getPostComments(postId: string): Promise<PostComment[]> {
    const { data, error } = await supabase
      .from('post_comments')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('post_id', postId)
      .eq('is_active', true)
      .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
  }

  // Get user's posts
  static async getUserPosts(userId: string, limit = 20, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('author_id', userId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  }

  // Search posts
  static async searchPosts(searchTerm: string, filters?: {
    postType?: string
    tags?: string[]
    groupId?: string
    eventId?: string
  }): Promise<Post[]> {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('is_active', true)
      .or(`content.ilike.%${searchTerm}%,tags.cs.{${searchTerm}}`)

    if (filters?.postType) {
      query = query.eq('post_type', filters.postType)
    }

    if (filters?.groupId) {
      query = query.eq('group_id', filters.groupId)
    }

    if (filters?.eventId) {
      query = query.eq('event_id', filters.eventId)
    }

    query = query.order('created_at', { ascending: false })

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  // Get featured posts
  static async getFeaturedPosts(limit = 5): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('is_featured', true)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  // Get posts by type
  static async getPostsByType(postType: Post['post_type'], limit = 20, offset = 0): Promise<Post[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:author_id (
          id,
          email,
          user_metadata
        )
      `)
      .eq('post_type', postType)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) throw error
    return data || []
  }

  // Update like count
  private static async updateLikeCount(postId: string): Promise<void> {
    const { count } = await supabase
      .from('post_likes')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    await supabase
      .from('posts')
      .update({ likes_count: count || 0 })
      .eq('id', postId)
  }

  // Update comment count
  private static async updateCommentCount(postId: string): Promise<void> {
    const { count } = await supabase
      .from('post_comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .eq('is_active', true)

    await supabase
      .from('posts')
      .update({ comments_count: count || 0 })
      .eq('id', postId)
  }

  // Update share count
  private static async updateShareCount(postId: string): Promise<void> {
    const { count } = await supabase
      .from('post_shares')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)

    await supabase
      .from('posts')
      .update({ shares_count: count || 0 })
      .eq('id', postId)
  }

  // Pin/Unpin post (admin only)
  static async togglePin(postId: string): Promise<void> {
    const { data: post } = await supabase
      .from('posts')
      .select('is_pinned')
      .eq('id', postId)
      .single()

    if (!post) throw new Error('Post not found')

    await supabase
      .from('posts')
      .update({ is_pinned: !post.is_pinned })
      .eq('id', postId)
  }

  // Feature/Unfeature post (admin only)
  static async toggleFeature(postId: string): Promise<void> {
    const { data: post } = await supabase
      .from('posts')
      .select('is_featured')
      .eq('id', postId)
      .single()

    if (!post) throw new Error('Post not found')

    await supabase
      .from('posts')
      .update({ is_featured: !post.is_featured })
      .eq('id', postId)
  }
}








