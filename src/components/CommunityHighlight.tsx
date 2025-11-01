'use client'

import React, { useState } from 'react'

const highlights = [
  {
    type: 'scripture',
    content: 'For where two or three gather in my name, there am I with them.',
    reference: 'Matthew 18:20'
  },
  {
    type: 'encouragement',
    content: 'Community is where we grow together in faith and love.',
    author: 'Your Fellowship Leaders'
  },
  {
    type: 'scripture',
    content: 'As iron sharpens iron, so one person sharpens another.',
    reference: 'Proverbs 27:17'
  },
  {
    type: 'encouragement',
    content: 'You are part of something beautiful—a community of believers.',
    author: 'The Gathered Community'
  }
]

export default function CommunityHighlight() {
  const [currentIndex] = useState(Math.floor(Math.random() * highlights.length))
  const highlight = highlights[currentIndex]

  return (
    <div className="bg-gradient-to-r from-[#D4AF37]/20 to-[#F5C451]/20 border border-[#D4AF37]/40 rounded-xl p-4 text-center">
      <div className="text-white">
        {highlight.type === 'scripture' ? (
          <>
            <p className="text-sm font-medium italic mb-1">
              &ldquo;{highlight.content}&rdquo;
            </p>
            <p className="text-xs text-white/80">
              {highlight.reference}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-medium mb-1">
              {highlight.content}
            </p>
            <p className="text-xs text-white/60">
              {highlight.author}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

