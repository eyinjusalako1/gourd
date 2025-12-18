'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'
import { BookOpen, Calendar, MessageCircle } from 'lucide-react'

interface ReflectionEntry {
  date: string
  reflection: string
}

const STORAGE_KEY = 'devotions_reflections'

export default function ReflectionsPage() {
  const router = useRouter()
  const [reflections, setReflections] = useState<ReflectionEntry[]>([])

  useEffect(() => {
    loadReflections()
  }, [])

  const loadReflections = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const reflectionsObj = JSON.parse(saved) as Record<string, string>
        // Convert to array and sort by date (newest first)
        const entries: ReflectionEntry[] = Object.entries(reflectionsObj)
          .map(([date, reflection]) => ({ date, reflection }))
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        setReflections(entries)
      }
    } catch (error) {
      console.error('Error loading reflections:', error)
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
      <BackButton label="Saved Reflections" />
      
      <div className="max-w-2xl mx-auto px-4 py-6">
        {reflections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-navy-800/40 border border-gold-500/20 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-gold-500/50" />
            </div>
            <h3 className="text-lg font-semibold text-slate-50 mb-2">Nothing saved yet</h3>
            <p className="text-slate-400 text-sm text-center max-w-sm">
              Reflections you save from daily readings will appear here.
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
            {reflections.map((entry, index) => (
              <div
                key={index}
                className="bg-navy-800/30 border border-white/10 rounded-xl p-6 hover:border-gold-500/30 transition-colors"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <MessageCircle className="w-5 h-5 text-gold-500" />
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(entry.date)}</span>
                  </div>
                </div>
                <p className="text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {entry.reflection}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

