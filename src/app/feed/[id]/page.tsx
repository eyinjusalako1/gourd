'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { PostService } from '@/lib/post-service'
import { Post, PostComment } from '@/types'
import { 
  ArrowLeft, 
  Heart,
  MessageCircle,
  Share2,
  Pin,
  Star,
  BookOpen,
  Prayer,
  HandHeart,
  Clock,
  Users,
  Calendar,
  MoreHorizontal,
  Send,
  Reply
} from 'lucide-react'

export default function PostDetailsPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<PostComment[]>([])
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  useEffect(() => {
    loadPostData()
  }, [params.id, user])

  const loadPostData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        PostService.getPost(params.id),
        PostService.getPostComments(params.id)
      ])

      setPost(postData)
      setComments(commentsData)

      if (user && postData) {
        const liked = await PostService.isLiked(postData.id, user.id)
        setIsLiked(liked)
      }
    } catch (error) {
      console.error('Error loading post data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!user || !post) return

    try {
      const liked = await PostService.toggleLike(post.id, user.id)
      setIsLiked(liked)
      setPost(prev => prev ? { ...prev, likes_count: liked ? prev.likes_count + 1 : prev.likes_count - 1 } : null)
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = async () => {
    if (!user || !post) return

    try {
      await PostService.sharePost(post.id, user.id)
      setPost(prev => prev ? { ...prev, shares_count: prev.shares_count + 1 } : null)
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !post || !newComment.trim()) return

    setCommentLoading(true)
    try {
      const comment = await PostService.addComment(post.id, user.id, newComment, replyingTo || undefined)
      setComments(prev => [...prev, comment])
      setPost(prev => prev ? { ...prev, comments_count: prev.comments_count + 1 } : null)
      setNewComment('')
      setReplyingTo(null)
    } catch (error) {
      console.error('Error adding comment:', error)
    } finally {
      setCommentLoading(false)
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'testimony':
        return <Heart className="w-6 h-6" />
      case 'scripture':
        return <BookOpen className="w-6 h-6" />
      case 'prayer_request':
        return <Prayer className="w-6 h-6" />
      case 'encouragement':
        return <HandHeart className="w-6 h-6" />
      default:
        return <MessageCircle className="w-6 h-6" />
    }
  }

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'testimony':
        return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400'
      case 'scripture':
        return 'bg-gold-100 text-gold-600 dark:bg-gold-900 dark:text-gold-400'
      case 'prayer_request':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400'
      case 'encouragement':
        return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400'
      default:
        return 'bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
    }
  }

  const formatPostDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const formatCommentDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Post Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The post you're looking for doesn't exist or has been removed.</p>
          <button onClick={() => router.push('/feed')} className="btn-primary">
            Back to Feed
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getPostTypeColor(post.post_type)}`}>
                  {getPostTypeIcon(post.post_type)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
                    {post.post_type.replace('_', ' ')}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{formatPostDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Post */}
            <div className="card">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-primary-600 dark:text-primary-400">
                      {(post as any).author?.user_metadata?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {(post as any).author?.user_metadata?.name || 'Unknown User'}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatPostDate(post.created_at)}</span>
                      {post.is_pinned && (
                        <>
                          <Pin className="w-3 h-3 text-primary-600" />
                          <span>Pinned</span>
                        </>
                      )}
                      {post.is_featured && (
                        <>
                          <Star className="w-3 h-3 text-gold-600" />
                          <span>Featured</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Post Content */}
              <div className="mb-6">
                <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap text-lg">
                  {post.content}
                </p>
                
                {/* Scripture Reference */}
                {post.scripture_reference && (
                  <div className="mt-4 p-4 bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-lg">
                    <div className="text-sm font-medium text-gold-800 dark:text-gold-200 mb-2">
                      Scripture Reference
                    </div>
                    <div className="text-gold-700 dark:text-gold-300 font-medium">
                      {post.scripture_reference}
                    </div>
                  </div>
                )}

                {/* Prayer Category */}
                {post.prayer_category && (
                  <div className="mt-4 inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                    {post.prayer_category} prayer
                  </div>
                )}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {post.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={handleLike}
                    className={`flex items-center space-x-2 transition-colors ${
                      isLiked
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                    }`}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                    <span className="font-medium">{post.likes_count}</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                  >
                    <Share2 className="w-6 h-6" />
                    <span className="font-medium">{post.shares_count}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="card">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Comments ({comments.length})
              </h2>

              {/* Add Comment */}
              {user && (
                <form onSubmit={handleAddComment} className="mb-6">
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {user.user_metadata?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="input-field resize-none"
                        rows={3}
                        required
                      />
                      <div className="flex justify-end mt-2">
                        <button
                          type="submit"
                          disabled={commentLoading || !newComment.trim()}
                          className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {commentLoading ? 'Posting...' : 'Post Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No comments yet. Be the first to share your thoughts!</p>
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {(comment as any).author?.user_metadata?.name?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {(comment as any).author?.user_metadata?.name || 'Unknown User'}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatCommentDate(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                          {comment.content}
                        </p>
                        <div className="flex items-center space-x-4">
                          <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
                            Like
                          </button>
                          <button 
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                          >
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Post Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Post Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Likes</span>
                  <span className="font-medium text-gray-900 dark:text-white">{post.likes_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Comments</span>
                  <span className="font-medium text-gray-900 dark:text-white">{post.comments_count}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Shares</span>
                  <span className="font-medium text-gray-900 dark:text-white">{post.shares_count}</span>
                </div>
              </div>
            </div>

            {/* Post Info */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Post Info</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${getPostTypeColor(post.post_type)}`}>
                      {getPostTypeIcon(post.post_type)}
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {post.post_type.replace('_', ' ')}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posted</span>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatPostDate(post.created_at)}
                  </div>
                </div>
                {post.is_pinned && (
                  <div className="flex items-center space-x-2 text-primary-600 dark:text-primary-400">
                    <Pin className="w-4 h-4" />
                    <span className="text-sm font-medium">Pinned Post</span>
                  </div>
                )}
                {post.is_featured && (
                  <div className="flex items-center space-x-2 text-gold-600 dark:text-gold-400">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-medium">Featured Post</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}








