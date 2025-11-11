'use client'

import { X, ThumbsDown } from 'lucide-react'
import type { Suggestion } from '@/lib/prefs'
import Link from 'next/link'

interface SuggestionCardProps {
  suggestion: Suggestion
  onDismiss: (id: string) => void
  onMuteType: (type: Suggestion['type']) => void
}

export default function SuggestionCard({ suggestion, onDismiss, onMuteType }: SuggestionCardProps) {
  return (
    <div className="bg-white/5 border border-[#D4AF37]/30 rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-[#F5C451]/5 to-transparent pointer-events-none" />
      <div className="relative z-10 space-y-3">
        <header className="flex items-start justify-between">
          <div>
            <span className="uppercase text-[10px] tracking-wider text-white/50">{suggestion.type.replaceAll('_', ' ')}</span>
            <h3 className="text-base font-semibold text-white">{suggestion.title}</h3>
          </div>
          <button
            onClick={() => onDismiss(suggestion.id)}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
            aria-label="Dismiss suggestion"
          >
            <X className="w-4 h-4" />
          </button>
        </header>

        <p className="text-sm text-white/70 leading-relaxed">{suggestion.description}</p>

        <div className="flex items-center justify-between">
          {suggestion.actionUrl ? (
            <Link
              href={suggestion.actionUrl}
              className="inline-flex items-center justify-center px-3 py-2 rounded-xl bg-[#D4AF37] text-[#0F1433] text-sm font-semibold hover:bg-[#F5C451] transition-colors"
            >
              Explore
            </Link>
          ) : (
            <div />
          )}
          <button
            onClick={() => onMuteType(suggestion.type)}
            className="inline-flex items-center space-x-1 text-xs text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] rounded-lg px-2 py-1"
          >
            <ThumbsDown className="w-3 h-3" />
            <span>Show less like this</span>
          </button>
        </div>
      </div>
    </div>
  )
}


