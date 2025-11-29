# Bible Data Fetcher

This script automatically fetches Bible text from the GetBible API and saves it in the correct JSON format for your app.

## Requirements

- Node.js 18+ (for built-in `fetch` support)
- Internet connection

## Usage

### Fetch a single book:
```bash
node scripts/fetch-bible.js John
```

### Fetch multiple books:
```bash
node scripts/fetch-bible.js John Matthew Mark Luke
```

### Fetch all 66 books:
```bash
node scripts/fetch-bible.js
```
⚠️ **Warning:** This will take 30-60 minutes and make ~1,189 API requests!

## Output

All books are saved to `src/data/bibles/web/{BookName}.json` in the format:
```json
[
  [
    "Verse 1 text...",
    "Verse 2 text...",
    ...
  ],
  [
    "Chapter 2, Verse 1...",
    ...
  ]
]
```

Where:
- Outer array = chapters
- Inner array = verses

## Notes

- The script uses the World English Bible (WEB) translation from GetBible API
- Rate limiting is built in (200ms between chapters, 500ms between books)
- If a chapter fails, it saves an empty array to maintain structure
- You can cancel anytime with Ctrl+C

## Troubleshooting

If you get errors:
1. Check your internet connection
2. Make sure you're using Node.js 18+
3. The API might be temporarily unavailable - try again later
4. Some book names might need adjustment in the `BOOK_NAME_MAP` if the API format changes

