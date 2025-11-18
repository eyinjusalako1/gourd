'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles } from 'lucide-react'
import { getBookById } from '@/data/bible-books'
// Import John data - Next.js handles JSON imports
import johnData from '@/data/bibles/web/John.json'

interface BibleReaderProps {
  book: string
  chapter: number
}

// Type for the Bible data structure: array of chapters, each chapter is array of verse strings
type BibleData = string[][]

export default function BibleReader({ book, chapter }: BibleReaderProps) {
  const router = useRouter()
  const verseRefs = useRef<{ [key: number]: HTMLParagraphElement | null }>({})
  const [isScrolled, setIsScrolled] = useState(false)

  // Load the correct book data (for now, only John is available)
  const getBibleData = (): BibleData | null => {
    if (book === 'John') {
      return johnData as BibleData
    }
    return null
  }

  const bibleData = getBibleData()
  const verses = bibleData?.[chapter - 1] || []

  // Handle hash navigation (e.g., #v16)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const hash = window.location.hash
    if (hash && hash.startsWith('#v')) {
      const verseNum = parseInt(hash.substring(2), 10)
      if (verseNum >= 1 && verseNum <= verses.length) {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = verseRefs.current[verseNum]
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' })
            setIsScrolled(true)
          }
        }, 100)
      }
    }
  }, [verses.length])

  // Handle "Study with Faith Guide" button
  const handleStudyClick = async () => {
    const verseText = verses.join(' ')
    const ref = `${book} ${chapter}`

    try {
      const response = await fetch('/api/faith-study', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref,
          text: verseText,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch study guide')
      }

      const data = await response.json()
      
      // For now, just show an alert. Later we can create a modal or new page.
      alert(`Faith Guide Study for ${ref}\n\n${data.explanation}\n\nReflections:\n${data.reflections.join('\n')}`)
    } catch (error) {
      console.error('Error fetching study guide:', error)
      alert('Study guide is not available right now. Please try again later.')
    }
  }

  if (!bibleData) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white/5 border border-red-500/30 rounded-xl p-6 text-center">
          <p className="text-white/80">
            Book &quot;{book}&quot; is not available yet.
          </p>
        </div>
      </div>
    )
  }

  if (verses.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <div className="bg-white/5 border border-yellow-500/30 rounded-xl p-6 text-center">
          <p className="text-white/80">
            Chapter {chapter} has no verses available.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Study Button - Sticky at top */}
      <div className="sticky top-0 z-10 bg-[#0F1433] border-b border-[#D4AF37]/30 px-4 py-3">
        <button
          onClick={handleStudyClick}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] px-4 py-3 rounded-lg font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
        >
          <Sparkles className="w-5 h-5" />
          <span>Study with Faith Guide</span>
        </button>
      </div>

      {/* Verses */}
      <div className="px-4 py-6">
        <div className="space-y-6">
          {verses.map((verseText, index) => {
            const verseNumber = index + 1
            return (
              <p
                key={verseNumber}
                id={`v${verseNumber}`}
                ref={(el) => {
                  verseRefs.current[verseNumber] = el
                }}
                className="text-white text-base leading-relaxed"
                style={{
                  fontSize: '18px',
                  lineHeight: '1.6',
                  paddingBottom: '16px',
                }}
              >
                <sup
                  className="text-[#D4AF37] font-semibold mr-1"
                  style={{ fontSize: '14px' }}
                >
                  {verseNumber}
                </sup>
                {verseText.trim()}
              </p>
            )
          })}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="sticky bottom-0 bg-[#0F1433] border-t border-[#D4AF37]/30 px-4 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (chapter > 1) {
                router.push(`/bible/${book}/${chapter - 1}`)
              }
            }}
            disabled={chapter === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              chapter === 1
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            ← Previous
          </button>

          <span className="text-white/60 text-sm">
            {book} {chapter}
          </span>

          <button
            onClick={() => {
              const bookData = getBookById(book)
              const maxChapters = bookData?.chapters || 1
              if (chapter < maxChapters) {
                router.push(`/bible/${book}/${chapter + 1}`)
              }
            }}
            disabled={(() => {
              const bookData = getBookById(book)
              return chapter >= (bookData?.chapters || 1)
            })()}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              (() => {
                const bookData = getBookById(book)
                return chapter >= (bookData?.chapters || 1)
              })()
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

