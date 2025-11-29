'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, BookOpen, ChevronLeft, ChevronRight, Menu } from 'lucide-react'
import { getBookById, WEB_BOOKS } from '@/data/bible-books'
import BottomSheet from '@/components/ui/BottomSheet'
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
  const [showQuickNav, setShowQuickNav] = useState(false)

  // Load the correct book data (for now, only John is available)
  const getBibleData = (): BibleData | null => {
    if (book === 'John') {
      return johnData as BibleData
    }
    return null
  }

  const bibleData = getBibleData()
  const verses = bibleData?.[chapter - 1] || []
  const bookData = getBookById(book)
  const maxChapters = bookData?.chapters || 1

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

  const handleChapterSelect = (selectedChapter: number) => {
    router.push(`/bible/${book}/${selectedChapter}`)
    setShowQuickNav(false)
  }

  const handleBookSelect = (bookId: string) => {
    router.push(`/bible/${bookId}`)
    setShowQuickNav(false)
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

  const chapters = Array.from({ length: maxChapters }, (_, i) => i + 1)

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col">
      {/* Top Bar - Sticky */}
      <div className="sticky top-0 z-20 bg-[#0F1433] border-b border-[#D4AF37]/30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={() => setShowQuickNav(true)}
              className="p-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/10 min-h-[44px] min-w-[44px] flex items-center justify-center flex-shrink-0"
              aria-label="Quick Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-white truncate">
                {bookData?.name || book} {chapter}
              </h2>
              <p className="text-xs text-white/60">WEB</p>
            </div>
          </div>
        </div>
      </div>

      {/* Study Button */}
      <div className="px-4 py-3 border-b border-[#D4AF37]/30">
        <button
          onClick={handleStudyClick}
          className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] px-4 py-3 rounded-lg font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg min-h-[44px]"
        >
          <Sparkles className="w-5 h-5" />
          <span>Study with Faith Guide</span>
        </button>
      </div>

      {/* Verses - Scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
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

      {/* Bottom Navigation - Sticky */}
      <div 
        className="sticky bottom-0 bg-[#0F1433] border-t border-[#D4AF37]/30 px-4 py-4"
        style={{
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 1rem)',
        }}
      >
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              if (chapter > 1) {
                router.push(`/bible/${book}/${chapter - 1}`)
              }
            }}
            disabled={chapter === 1}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors min-h-[44px] ${
              chapter === 1
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <button
            onClick={() => setShowQuickNav(true)}
            className="px-4 py-3 rounded-lg font-medium bg-white/10 text-white hover:bg-white/20 transition-colors min-h-[44px] flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{bookData?.name || book} {chapter}</span>
          </button>

          <button
            onClick={() => {
              if (chapter < maxChapters) {
                router.push(`/bible/${book}/${chapter + 1}`)
              }
            }}
            disabled={chapter >= maxChapters}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors min-h-[44px] ${
              chapter >= maxChapters
                ? 'bg-white/5 text-white/30 cursor-not-allowed'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Navigation Sheet */}
      <BottomSheet
        isOpen={showQuickNav}
        onClose={() => setShowQuickNav(false)}
        title="Quick Navigation"
        maxHeight="85vh"
      >
        <div className="space-y-6">
          {/* Books List */}
          <div>
            <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">Books</h3>
            <div className="grid grid-cols-2 gap-2">
              {WEB_BOOKS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBookSelect(b.id)}
                  className={`px-4 py-3 rounded-xl font-medium transition-colors text-left min-h-[44px] ${
                    b.id === book
                      ? 'bg-[#F5C451] text-[#0F1433]'
                      : 'bg-white/5 border border-[#D4AF37]/30 text-white hover:bg-white/10'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Chapters List */}
          {bookData && (
            <div>
              <h3 className="text-sm font-semibold text-white/80 mb-3 uppercase tracking-wide">
                {bookData.name} Chapters
              </h3>
              <div className="grid grid-cols-5 gap-2">
                {chapters.map((ch) => (
                  <button
                    key={ch}
                    onClick={() => handleChapterSelect(ch)}
                    className={`aspect-square rounded-xl font-semibold transition-colors min-h-[44px] ${
                      ch === chapter
                        ? 'bg-[#F5C451] text-[#0F1433]'
                        : 'bg-white/5 border border-[#D4AF37]/30 text-white hover:bg-white/10'
                    }`}
                  >
                    {ch}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </BottomSheet>
    </div>
  )
}
