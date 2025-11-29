export interface BibleBook {
  id: string
  name: string
  chapters: number
  chapterCount: number // Alias for chapters for clarity
}

export const WEB_BOOKS: BibleBook[] = [
  { id: 'John', name: 'John', chapters: 21, chapterCount: 21 },
  // add the rest later
]

// Helper to get book by id
export function getBookById(id: string): BibleBook | undefined {
  return WEB_BOOKS.find(book => book.id === id)
}
  