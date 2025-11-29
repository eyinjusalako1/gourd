'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { PostService } from '@/lib/post-service'
import { Post } from '@/types'
import { 
  Plus, 
  Search, 
  Filter,
  Heart,
  MessageCircle,
  Share2,
  Pin,
  Star,
  BookOpen,
  Prayer,
  Megaphone,
  HandHeart,
  Calendar,
  Users,
  Clock,
  MoreHorizontal
} from 'lucide-react'

export default function FeedPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const data = await PostService.getPosts(user?.id, 20, 0)
      setPosts(data)
      
      // Load liked status for each post
      if (user) {
        const likedPromises = data.map(post => PostService.isLiked(post.id, user.id))
        const likedResults = await Promise.all(likedPromises)
        const likedSet = new Set<string>()
        data.forEach((post, index) => {
          if (likedResults[index]) {
            likedSet.add(post.id)
          }
        })
        setLikedPosts(likedSet)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId: string) => {
    if (!user) return

    try {
      const isLiked = await PostService.toggleLike(postId, user.id)
      setLikedPosts(prev => {
        const newSet = new Set(prev)
        if (isLiked) {
          newSet.add(postId)
        } else {
          newSet.delete(postId)
        }
        return newSet
      })
      
      // Update local posts
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes_count: isLiked ? post.likes_count + 1 : post.likes_count - 1 }
          : post
      ))
    } catch (error) {
      console.error('Error toggling like:', error)
    }
  }

  const handleShare = async (postId: string) => {
    if (!user) return

    try {
      await PostService.sharePost(postId, user.id)
      // Update local posts
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, shares_count: post.shares_count + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = filterType === 'all' || post.post_type === filterType
    
    return matchesSearch && matchesType
  })

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'testimony':
        return <Heart className="w-5 h-5" />
      case 'scripture':
        return <BookOpen className="w-5 h-5" />
      case 'prayer_request':
        return <Prayer className="w-5 h-5" />
      case 'encouragement':
        return <HandHeart className="w-5 h-5" />
      default:
        return <MessageCircle className="w-5 h-5" />
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
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 48) {
      return 'Yesterday'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading feed...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Community Feed</h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Share testimonies, scripture, and encouragement with fellow believers
              </p>
            </div>
            
            {user && (
              <button
                onClick={() => router.push('/feed/create')}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Share Post</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <select
                className="input-field"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Posts</option>
                <option value="testimony">Testimonies</option>
                <option value="scripture">Scripture</option>
                <option value="prayer_request">Prayer Requests</option>
                <option value="encouragement">Encouragement</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </div>

        {/* Posts Feed */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || filterType !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Be the first to share something with the community!'
              }
            </p>
            {user && (
              <button
                onClick={() => router.push('/feed/create')}
                className="btn-primary"
              >
                Share First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <div key={post.id} className="card hover:shadow-lg transition-shadow">
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                        {(post as any).author?.user_metadata?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {(post as any).author?.user_metadata?.name || 'Unknown User'}
                        </h3>
                        {post.is_pinned && (
                          <Pin className="w-4 h-4 text-primary-600" />
                        )}
                        {post.is_featured && (
                          <Star className="w-4 h-4 text-gold-600" />
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{formatPostDate(post.created_at)}</span>
                        <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getPostTypeColor(post.post_type)}`}>
                          {getPostTypeIcon(post.post_type)}
                          <span className="capitalize">{post.post_type.replace('_', ' ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  
                  {/* Scripture Reference */}
                  {post.scripture_reference && (
                    <div className="mt-3 p-3 bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-lg">
                      <div className="text-sm font-medium text-gold-800 dark:text-gold-200">
                        Scripture Reference
                      </div>
                      <div className="text-gold-700 dark:text-gold-300">
                        {post.scripture_reference}
                      </div>
                    </div>
                  )}

                  {/* Prayer Category */}
                  {post.prayer_category && (
                    <div className="mt-3 inline-block px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-sm rounded-full">
                      {post.prayer_category} prayer
                    </div>
                  )}
                </div>

                {/* Tags */}
                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-6">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center space-x-2 transition-colors ${
                        likedPosts.has(post.id)
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes_count}</span>
                    </button>
                    
                    <button
                      onClick={() => router.push(`/feed/${post.id}`)}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments_count}</span>
                    </button>
                    
                    <button
                      onClick={() => handleShare(post.id)}
                      className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span className="text-sm">{post.shares_count}</span>
                    </button>
                  </div>
                  
                  <button
                    onClick={() => router.push(`/feed/${post.id}`)}
                    className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                  >
                    View Post
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}








