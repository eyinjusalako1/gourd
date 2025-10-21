import React from 'react'
import { Heart } from 'lucide-react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`${sizeClasses[size]} bg-primary-600 rounded-lg flex items-center justify-center`}>
        <Heart className="w-6 h-6 text-white" />
      </div>
      <span className="font-bold text-gray-900 dark:text-white">
        Gathered
      </span>
    </div>
  )
}
