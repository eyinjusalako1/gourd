const fs = require('fs');
const path = require('path');
const https = require('https');

// Bible book names and chapter counts
const BIBLE_BOOKS = [
  { id: 'Genesis', name: 'Genesis', chapters: 50 },
  { id: 'Exodus', name: 'Exodus', chapters: 40 },
  { id: 'Leviticus', name: 'Leviticus', chapters: 27 },
  { id: 'Numbers', name: 'Numbers', chapters: 36 },
  { id: 'Deuteronomy', name: 'Deuteronomy', chapters: 28 },
  { id: 'Joshua', name: 'Joshua', chapters: 24 },
  { id: 'Judges', name: 'Judges', chapters: 21 },
  { id: 'Ruth', name: 'Ruth', chapters: 4 },
  { id: '1 Samuel', name: '1 Samuel', chapters: 31 },
  { id: '2 Samuel', name: '2 Samuel', chapters: 24 },
  { id: '1 Kings', name: '1 Kings', chapters: 22 },
  { id: '2 Kings', name: '2 Kings', chapters: 25 },
  { id: '1 Chronicles', name: '1 Chronicles', chapters: 29 },
  { id: '2 Chronicles', name: '2 Chronicles', chapters: 36 },
  { id: 'Ezra', name: 'Ezra', chapters: 10 },
  { id: 'Nehemiah', name: 'Nehemiah', chapters: 13 },
  { id: 'Esther', name: 'Esther', chapters: 10 },
  { id: 'Job', name: 'Job', chapters: 42 },
  { id: 'Psalms', name: 'Psalms', chapters: 150 },
  { id: 'Proverbs', name: 'Proverbs', chapters: 31 },
  { id: 'Ecclesiastes', name: 'Ecclesiastes', chapters: 12 },
  { id: 'Song of Solomon', name: 'Song of Solomon', chapters: 8 },
  { id: 'Isaiah', name: 'Isaiah', chapters: 66 },
  { id: 'Jeremiah', name: 'Jeremiah', chapters: 52 },
  { id: 'Lamentations', name: 'Lamentations', chapters: 5 },
  { id: 'Ezekiel', name: 'Ezekiel', chapters: 48 },
  { id: 'Daniel', name: 'Daniel', chapters: 12 },
  { id: 'Hosea', name: 'Hosea', chapters: 14 },
  { id: 'Joel', name: 'Joel', chapters: 3 },
  { id: 'Amos', name: 'Amos', chapters: 9 },
  { id: 'Obadiah', name: 'Obadiah', chapters: 1 },
  { id: 'Jonah', name: 'Jonah', chapters: 4 },
  { id: 'Micah', name: 'Micah', chapters: 7 },
  { id: 'Nahum', name: 'Nahum', chapters: 7 },
  { id: 'Habakkuk', name: 'Habakkuk', chapters: 3 },
  { id: 'Zephaniah', name: 'Zephaniah', chapters: 7 },
  { id: 'Haggai', name: 'Haggai', chapters: 2 },
  { id: 'Zechariah', name: 'Zechariah', chapters: 13 },
  { id: 'Malachi', name: 'Malachi', chapters: 6 },
  { id: 'Matthew', name: 'Matthew', chapters: 28 },
  { id: 'Mark', name: 'Mark', chapters: 16 },
  { id: 'Luke', name: 'Luke', chapters: 24 },
  { id: 'John', name: 'John', chapters: 21 },
  { id: 'Acts', name: 'Acts', chapters: 28 },
  { id: 'Romans', name: 'Romans', chapters: 16 },
  { id: '1 Corinthians', name: '1 Corinthians', chapters: 16 },
  { id: '2 Corinthians', name: '2 Corinthians', chapters: 13 },
  { id: 'Galatians', name: 'Galatians', chapters: 6 },
  { id: 'Ephesians', name: 'Ephesians', chapters: 6 },
  { id: 'Philippians', name: 'Philippians', chapters: 4 },
  { id: 'Colossians', name: 'Colossians', chapters: 4 },
  { id: '1 Thessalonians', name: '1 Thessalonians', chapters: 5 },
  { id: '2 Thessalonians', name: '2 Thessalonians', chapters: 3 },
  { id: '1 Timothy', name: '1 Timothy', chapters: 6 },
  { id: '2 Timothy', name: '2 Timothy', chapters: 4 },
  { id: 'Titus', name: 'Titus', chapters: 3 },
  { id: 'Philemon', name: 'Philemon', chapters: 1 },
  { id: 'Hebrews', name: 'Hebrews', chapters: 13 },
  { id: 'James', name: 'James', chapters: 5 },
  { id: '1 Peter', name: '1 Peter', chapters: 5 },
  { id: '2 Peter', name: '2 Peter', chapters: 3 },
  { id: '1 John', name: '1 John', chapters: 5 },
  { id: '2 John', name: '2 John', chapters: 1 },
  { id: '3 John', name: '3 John', chapters: 1 },
  { id: 'Jude', name: 'Jude', chapters: 1 },
  { id: 'Revelation', name: 'Revelation', chapters: 22 },
];

// Book name mapping for bible-api.com (uses hyphenated format)
const BOOK_NAME_MAP = {
  '1 Samuel': '1-samuel',
  '2 Samuel': '2-samuel',
  '1 Kings': '1-kings',
  '2 Kings': '2-kings',
  '1 Chronicles': '1-chronicles',
  '2 Chronicles': '2-chronicles',
  'Song of Solomon': 'song-of-solomon',
  '1 Corinthians': '1-corinthians',
  '2 Corinthians': '2-corinthians',
  '1 Thessalonians': '1-thessalonians',
  '2 Thessalonians': '2-thessalonians',
  '1 Timothy': '1-timothy',
  '2 Timothy': '2-timothy',
  '1 Peter': '1-peter',
  '2 Peter': '2-peter',
  '1 John': '1-john',
  '2 John': '2-john',
  '3 John': '3-john',
};

// Alternative: Use Bible API from github.com/wldeh/bible-api
// This API is more reliable and doesn't require authentication
async function fetchChapterFromBibleAPI(bookName, chapter, retries = 3) {
  try {
    // Convert book name to API format (hyphenated, lowercase)
    let apiBookName = BOOK_NAME_MAP[bookName] || bookName.toLowerCase().replace(/\s+/g, '-');
    
    // Bible API format: https://bible-api.com/{book}+{chapter}
    // Example: https://bible-api.com/john+1
    const url = `https://bible-api.com/${apiBookName}+${chapter}`;
    console.log(`  Fetching: ${bookName} ${chapter}...`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    // Handle rate limiting with retry
    if (response.status === 429) {
      if (retries > 0) {
        const waitTime = 5000; // Wait 5 seconds before retry
        console.log(`    ⏳ Rate limited. Waiting ${waitTime/1000}s before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return fetchChapterFromBibleAPI(bookName, chapter, retries - 1);
      }
      throw new Error(`HTTP ${response.status} - Rate limited (too many requests)`);
    }
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    // Bible API structure: { reference: "...", verses: [...], text: "..." }
    if (data.verses && Array.isArray(data.verses)) {
      // Extract verse text, sorted by verse number
      return data.verses
        .sort((a, b) => parseInt(a.verse) - parseInt(b.verse))
        .map(v => v.text || '')
        .filter(Boolean);
    }
    
    // Fallback: try to parse from text field
    if (data.text) {
      // Split by verse numbers (format: "1 text 2 text 3 text...")
      const verses = data.text.split(/\s+(?=\d+\s)/).map(v => v.trim()).filter(Boolean);
      return verses;
    }
    
    throw new Error('Unexpected API response format');
  } catch (error) {
    if (retries > 0 && error.message.includes('429')) {
      // Already handled retry above
      return null;
    }
    console.error(`    ✗ Error: ${error.message}`);
    return null;
  }
}

// Alternative: Bible Gateway API (requires API key, but more reliable)
// For now, we'll stick with GetBible as it's free and doesn't require auth

// Main function to fetch a book
async function fetchBook(book) {
  console.log(`\n📖 Fetching ${book.name} (${book.chapters} chapters)...`);
  const chapters = [];
  
  for (let chapterNum = 1; chapterNum <= book.chapters; chapterNum++) {
    const verses = await fetchChapterFromBibleAPI(book.name, chapterNum);
    
    if (verses && verses.length > 0) {
      chapters.push(verses);
      console.log(`    ✓ Chapter ${chapterNum}: ${verses.length} verses`);
    } else {
      console.log(`    ✗ Chapter ${chapterNum}: Failed`);
      chapters.push([]); // Keep structure consistent
    }
    
    // Rate limiting - be nice to the API (longer delay to avoid 429 errors)
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return chapters;
}

// Save book to JSON file
function saveBook(book, chapters) {
  const outputDir = path.join(__dirname, '..', 'src', 'data', 'bibles', 'web');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filePath = path.join(outputDir, `${book.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(chapters, null, 2));
  console.log(`  💾 Saved to ${filePath}\n`);
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length > 0) {
    // Fetch specific book(s)
    const bookNames = args;
    for (const bookName of bookNames) {
      const book = BIBLE_BOOKS.find(b => 
        b.id.toLowerCase() === bookName.toLowerCase() || 
        b.name.toLowerCase() === bookName.toLowerCase()
      );
      
      if (book) {
        const chapters = await fetchBook(book);
        saveBook(book, chapters);
      } else {
        console.error(`❌ Book "${bookName}" not found`);
        console.log('Available books:', BIBLE_BOOKS.map(b => b.id).join(', '));
      }
    }
  } else {
    // Fetch all books
    console.log('🚀 Starting to fetch all Bible books...\n');
    console.log('⚠️  This will take a while (~30-60 minutes for all 66 books).');
    console.log('   Press Ctrl+C to cancel at any time.\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const book of BIBLE_BOOKS) {
      try {
        const chapters = await fetchBook(book);
        const hasData = chapters.some(ch => ch.length > 0);
        
        if (hasData) {
          saveBook(book, chapters);
          successCount++;
        } else {
          console.log(`  ⚠️  ${book.name}: No data retrieved`);
          failCount++;
        }
      } catch (error) {
        console.error(`  ❌ Error processing ${book.name}:`, error.message);
        failCount++;
      }
      
      // Longer delay between books
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log('\n✅ Done!');
    console.log(`   Success: ${successCount} books`);
    console.log(`   Failed: ${failCount} books`);
  }
}

// Run the script
main().catch(console.error);

