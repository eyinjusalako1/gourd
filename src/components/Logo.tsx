import React from 'react'
import Image from 'next/image'

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
      <div className={`${sizeClasses[size]} relative`}>
        <Image 
          src="/logo.png.svg" 
          alt="Gathered Logo" 
          width={48} 
          height={48}
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-bold text-gray-900 dark:text-white">
        Gathered
      </span>
    </div>
  )
}
