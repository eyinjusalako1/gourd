type ClassValue = string | number | null | undefined | boolean | ClassDictionary | ClassArray
type ClassDictionary = Record<string, boolean | undefined | null>
type ClassArray = ClassValue[]

export function cn(...args: ClassValue[]): string {
  const classes: string[] = []

  const append = (value: ClassValue) => {
    if (!value) return
    if (typeof value === 'string' || typeof value === 'number') {
      classes.push(String(value))
    } else if (Array.isArray(value)) {
      value.forEach(append)
    } else if (typeof value === 'object') {
      for (const [key, condition] of Object.entries(value)) {
        if (condition) classes.push(key)
      }
    }
  }

  args.forEach(append)
  return classes.join(' ')
}


