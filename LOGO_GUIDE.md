# Adding Logos and Icons to Gathered

## Method 1: Using Lucide React Icons (Current)
We're already using Lucide React icons. You can use any of these:
- `Heart`, `Cross`, `Church`, `Users`, `Calendar`, `BookOpen`, etc.

## Method 2: Custom SVG Logo
1. Create a `public` folder in your project root
2. Add your logo as `public/logo.svg`
3. Use it like this:

```tsx
import Image from 'next/image'

<Image 
  src="/logo.svg" 
  alt="Gathered Logo" 
  width={40} 
  height={40} 
/>
```

## Method 3: Custom PNG/JPG Logo
1. Add your logo to `public/logo.png`
2. Use it like this:

```tsx
<Image 
  src="/logo.png" 
  alt="Gathered Logo" 
  width={40} 
  height={40} 
/>
```

## Method 4: Favicon
1. Add `public/favicon.ico` (16x16 or 32x32 pixels)
2. Next.js will automatically use it

## Method 5: Custom Icon Component
Create your own icon component:

```tsx
export function ChurchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7v10h3v8h6v-6h2v6h6V7L12 2z"/>
    </svg>
  )
}
```

## Recommended Logo Sizes:
- Header logo: 40x40px
- Hero logo: 80x80px  
- Favicon: 32x32px
- Social media: 512x512px






