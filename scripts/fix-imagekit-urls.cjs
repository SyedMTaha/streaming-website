const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBYpNwKhRGk8wvZoA5YytI87fG5g8Dy7q4",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "streaming-website-fe2fd.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "streaming-website-fe2fd",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "streaming-website-fe2fd.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "336587356779",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:336587356779:web:41dc6d4722732dec890f2e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// ImageKit URL endpoint
const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/epnaccvj6';

// Function to extract filename from various path formats
function extractFilename(path) {
  if (!path) return '';
  
  // Remove query parameters if any
  const cleanPath = path.split('?')[0];
  
  // Extract just the filename
  const parts = cleanPath.split('/');
  return parts[parts.length - 1];
}

// Function to build correct ImageKit URL
function buildCorrectImageKitUrl(originalPath, genre, isLandscape) {
  if (!originalPath) return '';
  
  const filename = extractFilename(originalPath);
  
  // Build the correct URL based on your folder structure
  if (isLandscape) {
    return `${IMAGEKIT_URL_ENDPOINT}/movies/${genre}/landscape/${filename}`;
  } else {
    return `${IMAGEKIT_URL_ENDPOINT}/movies/${genre}/${filename}`;
  }
}

// Function to fix a single movie's image URLs
async function fixMovieImageUrls(movieId, docData) {
  try {
    const updates = {};
    
    // Always update portrait image
    if (docData.image) {
      const newPortraitUrl = buildCorrectImageKitUrl(docData.image, docData.genre, false);
      if (newPortraitUrl !== docData.image) {
        updates.image = newPortraitUrl;
      }
    }
    
    // Always update landscape image
    if (docData.innerImage) {
      const newLandscapeUrl = buildCorrectImageKitUrl(docData.innerImage, docData.genre, true);
      if (newLandscapeUrl !== docData.innerImage) {
        updates.innerImage = newLandscapeUrl;
      }
    }
    
    // Only update if there are changes
    if (Object.keys(updates).length > 0) {
      const movieRef = doc(db, 'movies', movieId);
      await updateDoc(movieRef, {
        ...updates,
        updatedAt: new Date(),
        imageUrlsFixed: true
      });
      
      console.log(`✅ Fixed "${docData.title}" (${docData.genre})`);
      if (updates.image) console.log(`   Portrait: ${updates.image}`);
      if (updates.innerImage) console.log(`   Landscape: ${updates.innerImage}`);
      
      return { success: true, fixed: true };
    } else {
      console.log(`✓ "${docData.title}" - URLs are already correct`);
      return { success: true, fixed: false };
    }
    
  } catch (error) {
    console.error(`❌ Error fixing "${docData.title}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Main function to fix all movies
async function fixAllMovieUrls() {
  console.log('🚀 Starting ImageKit URL fix...\n');
  
  try {
    // Fetch all movies
    const moviesRef = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesRef);
    
    let totalMovies = querySnapshot.size;
    let fixedCount = 0;
    let correctCount = 0;
    let errorCount = 0;
    
    console.log(`📊 Found ${totalMovies} movies to check\n`);
    console.log('Checking and fixing URLs...\n');
    
    // Group movies by genre for better logging
    const moviesByGenre = {};
    querySnapshot.forEach(doc => {
      const data = doc.data();
      const genre = data.genre || 'unknown';
      if (!moviesByGenre[genre]) {
        moviesByGenre[genre] = [];
      }
      moviesByGenre[genre].push({ id: doc.id, ...data });
    });
    
    // Process movies by genre
    for (const [genre, movies] of Object.entries(moviesByGenre)) {
      console.log(`\n📂 Processing ${genre} movies (${movies.length} items):`);
      
      for (const movie of movies) {
        const result = await fixMovieImageUrls(movie.id, movie);
        
        if (result.success) {
          if (result.fixed) {
            fixedCount++;
          } else {
            correctCount++;
          }
        } else {
          errorCount++;
        }
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Fix Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Fixed: ${fixedCount} movies`);
    console.log(`✓ Already correct: ${correctCount} movies`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${totalMovies}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ URL fix completed!');
    
    if (fixedCount > 0) {
      console.log('\n💡 All movie image URLs now follow the correct structure:');
      console.log('- Portrait: /movies/[genre]/[filename]');
      console.log('- Landscape: /movies/[genre]/landscape/[filename]');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during fix:', error);
  }
  
  process.exit(0);
}

// Run the fix
console.log('='.repeat(50));
console.log('🔧 ImageKit URL Fix Tool');
console.log('='.repeat(50));
console.log('\nThis script will fix all movie image URLs to use the correct ImageKit structure.');
console.log('It will ensure all URLs follow your folder organization:\n');
console.log('- Portrait images: /movies/[genre]/[filename]');
console.log('- Landscape images: /movies/[genre]/landscape/[filename]\n');

// Start the fix
fixAllMovieUrls();
