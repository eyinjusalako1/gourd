/**
 * Generate a deterministic gradient from a string (e.g., group name)
 * Returns a CSS linear-gradient string in navy/gold/purple range
 */
export const getGradientFromName = (name: string): string => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  // Generate colors in navy/gold/purple range
  const hue1 = (hash % 60) + 200 // 200-260 (blue/purple range)
  const hue2 = (hash % 40) + 40  // 40-80 (gold/yellow range)
  const sat = 60 + (hash % 20)   // 60-80% saturation
  const light1 = 25 + (hash % 15) // 25-40% lightness (dark)
  const light2 = 35 + (hash % 15) // 35-50% lightness (slightly lighter)
  
  return `linear-gradient(135deg, hsl(${hue1}, ${sat}%, ${light1}%), hsl(${hue2}, ${sat}%, ${light2}%))`
}

