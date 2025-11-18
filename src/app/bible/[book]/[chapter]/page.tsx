'use client'

import { useParams, useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { getBookById } from '@/data/bible-books'
import AppHeader from '@/components/AppHeader'

// Dynamically import BibleReader to reduce initial bundle size
const BibleReader = dynamic(() => import('@/components/bible/BibleReader'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F5C451] mx-auto mb-4"></div>
        <p className="text-white/60">Loading chapter...</p>
      </div>
    </div>
  ),
})

export default function BibleChapterPage() {
  const params = useParams()
  const router = useRouter()
  const bookId = params.book as string
  const chapterParam = params.chapter as string

  const book = getBookById(bookId)
  const chapter = parseInt(chapterParam, 10)

  // Validate book exists
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

  // Validate chapter number
  if (isNaN(chapter) || chapter < 1 || chapter > book.chapters) {
    return (
      <div className="min-h-screen bg-[#0F1433] pb-20">
        <AppHeader
          title={book.name}
          subtitle=""
          backHref={`/bible/${bookId}`}
        />
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="bg-white/5 border border-red-500/30 rounded-xl p-6 text-center">
            <p className="text-white/80 mb-4">
              Chapter {chapterParam} not found.
              <br />
              {book.name} has {book.chapters} {book.chapters === 1 ? 'chapter' : 'chapters'}.
            </p>
            <button
              onClick={() => router.push(`/bible/${bookId}`)}
              className="bg-[#F5C451] text-[#0F1433] px-6 py-2 rounded-lg font-semibold hover:bg-[#D4AF37] transition-colors"
            >
              Back to Chapters
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F1433]">
      <AppHeader
        title={`${book.name} ${chapter}`}
        subtitle="World English Bible"
        backHref={`/bible/${bookId}`}
      />
      <BibleReader book={bookId} chapter={chapter} />
    </div>
  )
}

