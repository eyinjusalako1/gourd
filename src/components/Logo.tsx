'use client'

import { Crown } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

export default function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12', 
    lg: 'w-16 h-16'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <div className={`${sizeClasses[size]} relative`}>
        {/* Background circle */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#D4AF37] to-[#F5C451] rounded-full"></div>
        
        {/* Cross */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute w-1 h-6 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
            {/* Horizontal line */}
            <div className="absolute w-6 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
          </div>
        </div>

        {/* Golden rays */}
        <div className="absolute inset-0">
          {/* Top rays */}
          <div className="absolute top-1 left-1/2 w-0.5 h-2 bg-[#D4AF37] transform -translate-x-1/2 rotate-12"></div>
          <div className="absolute top-1 right-1/2 w-0.5 h-2 bg-[#D4AF37] transform translate-x-1/2 -rotate-12"></div>
          {/* Side rays */}
          <div className="absolute left-1 top-1/2 w-2 h-0.5 bg-[#D4AF37] transform -translate-y-1/2 rotate-12"></div>
          <div className="absolute right-1 top-1/2 w-2 h-0.5 bg-[#D4AF37] transform -translate-y-1/2 -rotate-12"></div>
        </div>

        {/* Golden dots */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/2 w-1 h-1 bg-[#D4AF37] rounded-full transform -translate-x-1/2"></div>
          <div className="absolute top-1/4 left-1/4 w-0.5 h-0.5 bg-[#D4AF37] rounded-full"></div>
          <div className="absolute top-1/4 right-1/4 w-0.5 h-0.5 bg-[#D4AF37] rounded-full"></div>
        </div>

        {/* Golden figures (simplified as dots for smaller sizes) */}
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-0.5">
            <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
            <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
            <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
            <div className="w-1 h-1 bg-[#D4AF37] rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-white ${textSizes[size]}`}>
          Gathered
        </span>
      )}
    </div>
  )
}