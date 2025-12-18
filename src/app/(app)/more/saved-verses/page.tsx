'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import { Star, Copy, Calendar } from 'lucide-react'
import { useToast } from '@/components/ui/Toast'

interface SavedVerse {
  verse: string
  text: string
  date: string
}

const STORAGE_KEY = 'devotions_saved_verses'

export default function SavedVersesPage() {
  const router = useRouter()
  const toast = useToast()
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([])

  useEffect(() => {
    loadSavedVerses()
  }, [])

  const loadSavedVerses = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const verses = JSON.parse(saved) as SavedVerse[]
        // Sort by date (newest first)
        const sorted = verses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setSavedVerses(sorted)
      }
    } catch (error) {
      console.error('Error loading saved verses:', error)
    }
  }

  const handleCopyVerse = async (verse: SavedVerse) => {
    const text = `${verse.verse} - ${verse.text}`
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: 'Verse copied!',
        description: 'The verse has been copied to your clipboard.',
        variant: 'success',
        duration: 2000,
      })
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again.',
        variant: 'error',
        duration: 2000,
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-navy-900 pb-20">
      <BackButton label="Saved Verses" />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {savedVerses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-navy-800/40 border border-gold-500/20 rounded-full flex items-center justify-center mb-4">
              <Star className="w-8 h-8 text-gold-500/50" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Nothing saved yet</h3>
            <p className="text-slate-400 text-sm text-center max-w-sm">
              Verses you save from the Verse of the Day will appear here.
            </p>
            <button
              onClick={() => router.push('/devotions')}
              className="mt-6 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-navy-900 rounded-lg font-medium transition-colors"
            >
              Go to Devotions
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedVerses.map((verse, index) => (
              <div
                key={index}
                className="bg-navy-800/30 border border-white/10 rounded-xl p-6 hover:border-gold-500/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-gold-500" />
                    <h3 className="text-lg font-semibold text-gold-500">{verse.verse}</h3>
                  </div>
                  <button
                    onClick={() => handleCopyVerse(verse)}
                    className="p-2 border border-gold-600/40 text-gold-500 hover:bg-gold-500/10 rounded-lg transition-colors"
                    title="Copy verse"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-slate-200 leading-relaxed mb-3 italic">
                  &quot;{verse.text}&quot;
                </p>
                <div className="flex items-center space-x-2 text-xs text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(verse.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

