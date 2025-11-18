'use client'

import { useParams, useRouter } from 'next/navigation'
import { getBookById } from '@/data/bible-books'
import AppHeader from '@/components/AppHeader'

export default function BibleBookPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.book as string

  const book = getBookById(bookId)

  if (!book) {
    return (
      <div className="min-h-screen bg-[#0F1433] pb-20">
        <AppHeader
          title="Book Not Found"
          subtitle=""
          backHref="/bible"
        />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white/5 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-white/80 mb-4">
              The book &quot;{bookId}&quot; was not found.
            </p>
            <button
              onClick={() => router.push('/bible')}
              className="bg-[#F5C451] text-[#0F1433] px-6 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
            >
              Back to Books
            </button>
          </div>
        </div>
      </div>
    )
  }

  const chapters = Array.from({ length: book.chapters }, (_, i) => i + 1)

  const handleChapterClick = (chapter: number) => {
    router.push(`/bible/${bookId}/${chapter}`)
  }

  return (
    <div className="min-h-screen bg-[#0F1433] pb-20">
      <AppHeader
        title={book.name}
        subtitle={`${book.chapters} chapters`}
        backHref="/bible"
      />

      <div className="max-w-md mx-auto px-4 py-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">Chapters</h2>
          <p className="text-sm text-white/60">
            Select a chapter to begin reading
          </p>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => handleChapterClick(chapter)}
              className="aspect-square bg-white/5 border border-[#D4AF37]/30 rounded-xl flex items-center justify-center hover:bg-white/10 hover:border-[#F5C451] transition-colors group"
            >
              <span className="text-lg font-semibold text-white group-hover:text-[#F5C451] transition-colors">
                {chapter}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

