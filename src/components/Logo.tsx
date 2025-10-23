import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  className?: string
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  showText = true, 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  }

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* SVG Logo */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background Circle */}
          <circle
            cx="50"
            cy="50"
            r="48"
            fill="#0F1433"
            stroke="#D4AF37"
            strokeWidth="2"
          />
          
          {/* Cross */}
          <rect
            x="45"
            y="20"
            width="10"
            height="60"
            fill="#F5C451"
            rx="2"
          />
          <rect
            x="20"
            y="45"
            width="60"
            height="10"
            fill="#F5C451"
            rx="2"
          />
          
          {/* Golden Rays */}
          <g fill="#D4AF37" opacity="0.8">
            {/* Top ray */}
            <rect x="48" y="5" width="4" height="12" rx="2" />
            {/* Right ray */}
            <rect x="83" y="48" width="12" height="4" rx="2" />
            {/* Bottom ray */}
            <rect x="48" y="83" width="4" height="12" rx="2" />
            {/* Left ray */}
            <rect x="5" y="48" width="12" height="4" rx="2" />
          </g>
          
          {/* Community Figures */}
          <g fill="#FFFFFF" opacity="0.9">
            {/* Left figure */}
            <circle cx="25" cy="70" r="4" />
            <rect x="23" y="74" width="4" height="8" rx="2" />
            
            {/* Right figure */}
            <circle cx="75" cy="70" r="4" />
            <rect x="73" y="74" width="4" height="8" rx="2" />
            
            {/* Center figure */}
            <circle cx="50" cy="75" r="3" />
            <rect x="48.5" y="78" width="3" height="6" rx="1.5" />
          </g>
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <span className={`font-bold text-white ${textSizes[size]}`}>
          Gathered
        </span>
      )}
    </div>
  )
}

export default Logo