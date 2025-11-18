# Simple Guide: Fetching Bible Data

## Quick Start

You have an automated script that fetches all Bible books for you. No manual coding needed!

---

## Step 1: Complete John (Finish the remaining chapters)

John currently has 15 out of 21 chapters. To complete it:

1. Open your terminal/command prompt
2. Navigate to your project folder (if not already there):
   ```bash
   cd c:\Users\user\gourd
   ```
3. Run the script to fetch the remaining chapters:
   ```bash
   node scripts/fetch-bible.js John
   ```
4. Wait for it to finish (about 2-3 minutes)
   - It will automatically retry if it hits rate limits
   - You'll see progress messages for each chapter

**Done!** John.json will now have all 21 chapters.

---

## Step 2: Fetch Other Books (Optional)

### Option A: Fetch One Book at a Time
```bash
node scripts/fetch-bible.js Matthew
node scripts/fetch-bible.js Mark
node scripts/fetch-bible.js Luke
```

### Option B: Fetch Multiple Books at Once
```bash
node scripts/fetch-bible.js Matthew Mark Luke Acts
```

### Option C: Fetch All 66 Books (Takes 30-60 minutes)
```bash
node scripts/fetch-bible.js
```
⚠️ **Warning:** This makes ~1,189 API requests and takes a long time!

---

## Step 3: Verify the Files

After fetching, check that files were created:
- Location: `src/data/bibles/web/{BookName}.json`
- Format: Array of chapters, each chapter is an array of verses
- Example: `John.json`, `Matthew.json`, etc.

---

## Troubleshooting

### "Rate Limited" Errors
- **Solution:** The script automatically waits and retries
- If it keeps failing, wait 5-10 minutes and try again

### "Book not found" Error
- Make sure you're using the exact book name (e.g., "1 Corinthians" not "First Corinthians")
- Check `scripts/fetch-bible.js` for the list of available book names

### Script Won't Run
- Make sure you have Node.js 18+ installed
- Check: `node --version` (should be 18.0.0 or higher)

---

## What Gets Created

Each book becomes a JSON file like this:
```json
[
  [
    "Verse 1 of chapter 1",
    "Verse 2 of chapter 1",
    ...
  ],
  [
    "Verse 1 of chapter 2",
    "Verse 2 of chapter 2",
    ...
  ]
]
```

- **Outer array** = All chapters
- **Inner array** = All verses in that chapter

---

## Recommended Approach

1. **Start small:** Complete John first
2. **Test your app:** Make sure the Bible reading pages work with John
3. **Fetch as needed:** Add other books when you need them
4. **Or bulk fetch:** If you want all books, run the full fetch overnight

---

## That's It!

No manual coding required. Just run the script and it handles everything automatically! 🎉

