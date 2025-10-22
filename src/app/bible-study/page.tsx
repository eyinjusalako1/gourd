'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { BibleStudyService } from '@/lib/bible-study-service'
import { BibleVerse, StudyPlan, MemoryVerse } from '@/lib/bible-study-service'
import { 
  BookOpen, 
  Heart, 
  Star, 
  Share2, 
  Plus,
  Calendar,
  Clock,
  Target,
  Award,
  TrendingUp,
  Search,
  Filter,
  Play,
  Pause,
  CheckCircle,
  RotateCcw
} from 'lucide-react'

export default function BibleStudyPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'daily' | 'study-plans' | 'memory' | 'search'>('daily')
  const [dailyVerse, setDailyVerse] = useState<BibleVerse | null>(null)
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [memoryVerses, setMemoryVerses] = useState<MemoryVerse[]>([])
  const [searchResults, setSearchResults] = useState<BibleVerse[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      const [daily, plans, verses] = await Promise.all([
        BibleStudyService.getDailyVerse(),
        BibleStudyService.getStudyPlans(),
        user ? BibleStudyService.getMemoryVersesForReview(user.id) : Promise.resolve([])
      ])
      
      setDailyVerse(daily)
      setStudyPlans(plans)
      setMemoryVerses(verses)
    } catch (error) {
      console.error('Error loading Bible study data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    if (!query.trim()) return
    
    try {
      const results = await BibleStudyService.searchVerses(query)
      setSearchResults(results)
    } catch (error) {
      console.error('Error searching verses:', error)
    }
  }

  const handleAddMemoryVerse = async (verse: BibleVerse) => {
    if (!user) return
    
    try {
      await BibleStudyService.addMemoryVerse(
        user.id,
        `${verse.book} ${verse.chapter}:${verse.verse}`,
        verse.text,
        verse.translation
      )
      // Reload memory verses
      const verses = await BibleStudyService.getMemoryVersesForReview(user.id)
      setMemoryVerses(verses)
    } catch (error) {
      console.error('Error adding memory verse:', error)
    }
  }

  const handleReviewMemoryVerse = async (verseId: string, correct: boolean) => {
    try {
      await BibleStudyService.reviewMemoryVerse(verseId, correct)
      // Reload memory verses
      const verses = await BibleStudyService.getMemoryVersesForReview(user!.id)
      setMemoryVerses(verses)
    } catch (error) {
      console.error('Error reviewing memory verse:', error)
    }
  }

  const shareVerse = async (verse: BibleVerse) => {
    const shareText = `"${verse.text}" - ${verse.book} ${verse.chapter}:${verse.verse} (${verse.translation})`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Bible Verse',
          text: shareText,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText)
      alert('Verse copied to clipboard!')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading Bible study tools...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-gold-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bible Study Tools</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Grow in faith through scripture study and memorization
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'daily', label: 'Daily Verse', icon: Calendar },
                { id: 'study-plans', label: 'Study Plans', icon: Target },
                { id: 'memory', label: 'Memory Verses', icon: Heart },
                { id: 'search', label: 'Search', icon: Search }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Daily Verse Tab */}
        {activeTab === 'daily' && dailyVerse && (
          <div className="space-y-6">
            <div className="card">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Calendar className="w-6 h-6 text-gold-600" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Verse of the Day</h2>
                </div>
                
                <div className="bg-gold-50 dark:bg-gold-900/20 border border-gold-200 dark:border-gold-800 rounded-lg p-8 mb-6">
                  <blockquote className="text-xl text-gray-900 dark:text-white leading-relaxed mb-4">
                    "{dailyVerse.text}"
                  </blockquote>
                  <cite className="text-lg font-medium text-gold-700 dark:text-gold-300">
                    — {dailyVerse.book} {dailyVerse.chapter}:{dailyVerse.verse} ({dailyVerse.translation})
                  </cite>
                </div>

                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => shareVerse(dailyVerse)}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </button>
                  
                  {user && (
                    <button
                      onClick={() => handleAddMemoryVerse(dailyVerse)}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Heart className="w-4 h-4" />
                      <span>Memorize</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Popular Verses */}
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Popular Verses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['encouragement', 'comfort', 'love'].map(async (category) => {
                  const verses = await BibleStudyService.getPopularVerses(category)
                  return verses.slice(0, 2).map((verse, index) => (
                    <div key={`${category}_${index}`} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <blockquote className="text-gray-900 dark:text-white mb-3">
                        "{verse.text}"
                      </blockquote>
                      <cite className="text-sm text-gray-600 dark:text-gray-400">
                        {verse.book} {verse.chapter}:{verse.verse}
                      </cite>
                      <div className="flex justify-end space-x-2 mt-3">
                        <button
                          onClick={() => shareVerse(verse)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        {user && (
                          <button
                            onClick={() => handleAddMemoryVerse(verse)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                })}
              </div>
            </div>
          </div>
        )}

        {/* Study Plans Tab */}
        {activeTab === 'study-plans' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Study Plans</h2>
                <button className="btn-primary flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Create Plan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {studyPlans.map((plan) => (
                  <div key={plan.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="w-5 h-5 text-primary-600" />
                      <span className="text-sm font-medium text-primary-600 dark:text-primary-400 capitalize">
                        {plan.category.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {plan.title}
                    </h3>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>{plan.duration_days} days</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        plan.difficulty === 'beginner' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        plan.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' :
                        'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                      }`}>
                        {plan.difficulty}
                      </span>
                    </div>
                    
                    <button className="w-full btn-primary">
                      Start Study Plan
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Memory Verses Tab */}
        {activeTab === 'memory' && (
          <div className="space-y-6">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Memory Verses</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Heart className="w-4 h-4" />
                  <span>{memoryVerses.length} verses to review</span>
                </div>
              </div>

              {memoryVerses.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    No verses to review
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Add some memory verses to start memorizing scripture!
                  </p>
                  <button className="btn-primary">
                    Add Memory Verse
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {memoryVerses.map((verse) => (
                    <div key={verse.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {verse.verse_reference}
                          </h3>
                          <blockquote className="text-gray-700 dark:text-gray-300 mb-4">
                            "{verse.verse_text}"
                          </blockquote>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <span>Mastery: {verse.mastery_level}/10</span>
                            <span>Reviews: {verse.review_count}</span>
                            <span>Next: {new Date(verse.next_review).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleReviewMemoryVerse(verse.id, true)}
                            className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 rounded-full text-sm font-medium hover:bg-green-200 dark:hover:bg-green-800"
                          >
                            ✓ Correct
                          </button>
                          <button
                            onClick={() => handleReviewMemoryVerse(verse.id, false)}
                            className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-full text-sm font-medium hover:bg-red-200 dark:hover:bg-red-800"
                          >
                            ✗ Incorrect
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search Tab */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Search Scripture</h2>
              
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for verses by keyword..."
                    className="input-field pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                  />
                </div>
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="mt-3 btn-primary"
                >
                  Search Verses
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Search Results ({searchResults.length})
                  </h3>
                  {searchResults.map((verse, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <blockquote className="text-gray-900 dark:text-white mb-3">
                        "{verse.text}"
                      </blockquote>
                      <cite className="text-sm text-gray-600 dark:text-gray-400 mb-3 block">
                        {verse.book} {verse.chapter}:{verse.verse} ({verse.translation})
                      </cite>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => shareVerse(verse)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        {user && (
                          <button
                            onClick={() => handleAddMemoryVerse(verse)}
                            className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          >
                            <Heart className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


