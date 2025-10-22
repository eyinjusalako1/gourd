module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Gathered App Color Palette
        navy: {
          50: '#f8f9fc',
          100: '#f1f3f8',
          200: '#e2e7f1',
          300: '#c8d1e6',
          400: '#a8b5d6',
          500: '#8a9bc6',
          600: '#6b7fb5',
          700: '#4f5d8a',
          800: '#3a4566',
          900: '#0F1433', // Deep Navy
        },
        gold: {
          50: '#fffdf7',
          100: '#fef9e7',
          200: '#fdf2d1',
          300: '#fce8b5',
          400: '#fadc94',
          500: '#F5C451', // Gold
          600: '#D4AF37', // Deep Gold
          700: '#b8941f',
          800: '#9a7a1a',
          900: '#7c5f15',
        },
        beige: {
          50: '#fefcf8',
          100: '#fdf8f0',
          200: '#faf0e1',
          300: '#f6e6d2',
          400: '#f2dcc3',
          500: '#F2EBD9', // Warm Beige
          600: '#e6d4c0',
          700: '#d9c7a7',
          800: '#ccba8e',
          900: '#bfad75',
        },
        // Keep existing primary colors for compatibility
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        purple: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        }
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'Nunito Sans', 'Poppins', 'system-ui', 'sans-serif'],
        'rounded': ['Inter Rounded', 'Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'bounce-gentle': 'bounceGentle 1s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(212, 175, 55, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(212, 175, 55, 0.8)' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
