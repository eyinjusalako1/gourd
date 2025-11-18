import Link from "next/link";

const BOOKS = [
  {
    slug: "John",
    name: "John",
    chapters: 21,
  },
];

export default function BiblePage() {
  return (
    <main className="min-h-screen bg-[#0F1433] text-white px-4 py-6">
      <h1 className="text-2xl font-semibold mb-2">Bible (WEB)</h1>
      <p className="text-sm text-white/70 mb-6">
        Select a book to start reading.
      </p>

      <div className="grid grid-cols-2 gap-3 max-w-md">
        {BOOKS.map((book) => (
          <Link
            key={book.slug}
            href={`/bible/${book.slug}`}
            className="rounded-lg bg-white/5 border border-white/10 px-3 py-3 text-sm font-medium tappable hover:bg-white/10 transition"
          >
            {book.name}
          </Link>
        ))}
      </div>
    </main>
  );
}

