'use client'

import { useState, useEffect } from 'react'
import { BookOpen, Heart, Share2, ChevronLeft, ChevronRight } from 'lucide-react'

interface Verse {
  text: string
  reference: string
  translation: string
}

const sampleVerses: Verse[] = [
  {
    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, to give you hope and a future.",
    reference: "Jeremiah 29:11",
    translation: "NIV"
  },
  {
    text: "Trust in the Lord with all your heart and lean not on your own understanding; in all your ways submit to him, and he will make your paths straight.",
    reference: "Proverbs 3:5-6",
    translation: "NIV"
  },
  {
    text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.",
    reference: "Romans 8:28",
    translation: "NIV"
  },
  {
    text: "I can do all this through him who gives me strength.",
    reference: "Philippians 4:13",
    translation: "NIV"
  }
]

export default function VerseCard() {
  const [currentVerseIndex, setCurrentVerseIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isShared, setIsShared] = useState(false)

  const currentVerse = sampleVerses[currentVerseIndex]

  const nextVerse = () => {
    setCurrentVerseIndex((prev) => (prev + 1) % sampleVerses.length)
  }

  const prevVerse = () => {
    setCurrentVerseIndex((prev) => (prev - 1 + sampleVerses.length) % sampleVerses.length)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    setIsShared(true)
    // Copy verse to clipboard
    navigator.clipboard.writeText(`${currentVerse.text} - ${currentVerse.reference}`)
    setTimeout(() => setIsShared(false), 2000)
  }

  const startPrayer = () => {
    // Navigate to prayer feed or open prayer modal
    console.log('Starting prayer session')
  }

  return (
    <div className="bg-[#0F1433] text-white rounded-2xl p-6 shadow-md border border-yellow-400 relative overflow-hidden">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-transparent pointer-events-none"></div>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-[#F5C451]" />
          <span className="font-medium text-[#F5C451]">Verse of the Day</span>
        </div>
        <div className="flex space-x-1">
          <button
            onClick={prevVerse}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={nextVerse}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verse Content */}
      <div className="mb-6 relative z-10">
        <blockquote className="text-lg leading-relaxed mb-3 font-serif">
          &ldquo;{currentVerse.text}&rdquo;
        </blockquote>
        <cite className="text-sm text-[#F5C451]">
          — {currentVerse.reference} ({currentVerse.translation})
        </cite>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex space-x-4">
          <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked 
                ? 'bg-[#F5C451] text-[#0F1433]' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span className="text-sm font-medium">
              {isLiked ? 'Liked' : 'Like'}
            </span>
          </button>
          
          <button
            onClick={handleShare}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
              isShared 
                ? 'bg-green-500 text-white' 
                : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span className="text-sm font-medium">
              {isShared ? 'Copied!' : 'Share'}
            </span>
          </button>
        </div>

        <button
          onClick={startPrayer}
          className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] text-[#0F1433] px-6 py-3 rounded-lg font-semibold hover:from-[#F5C451] hover:to-[#D4AF37] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Prayer
        </button>
      </div>

      {/* Verse Indicators */}
      <div className="flex justify-center space-x-2 mt-4 relative z-10">
        {sampleVerses.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentVerseIndex(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentVerseIndex ? 'bg-[#F5C451]' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

