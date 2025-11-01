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
  },
  {
    type: 'stats',
    content: 'This week, 32 believers gathered in 5 fellowships.',
    subtext: 'Keep building community together!'
  },
  {
    type: 'stats',
    content: 'Over 45 prayer requests shared this month.',
    subtext: 'Prayer works! 🙏'
  }
]

export default function CommunityHighlight() {
  const [currentIndex] = useState(Math.floor(Math.random() * highlights.length))
  const highlight = highlights[currentIndex]

  return (
    <div className="bg-gradient-to-r from-[#D4AF37] to-[#F5C451] rounded-xl p-6 text-center shadow-lg">
      <div className="text-[#0F1433]">
        {highlight.type === 'scripture' ? (
          <>
            <p className="text-base font-medium italic mb-1">
              &ldquo;{highlight.content}&rdquo;
            </p>
            <p className="text-sm opacity-90">
              {highlight.reference}
            </p>
          </>
        ) : highlight.type === 'stats' ? (
          <>
            <p className="text-base font-bold mb-1">
              {highlight.content}
            </p>
            <p className="text-sm opacity-80">
              {highlight.subtext}
            </p>
          </>
        ) : (
          <>
            <p className="text-base font-medium mb-1">
              {highlight.content}
            </p>
            <p className="text-sm opacity-70">
              {highlight.author}
            </p>
          </>
        )}
      </div>
    </div>
  )
}

