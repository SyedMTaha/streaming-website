const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, query, where } = require('firebase/firestore');
const { readFileSync } = require('fs');
const { join } = require('path');

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

// Helper function to generate movie ID based on genre
function getGenreIdPrefix(genre) {
  const genreMapping = {
    'action': 'a',
    'adventure': 'adv',
    'animation': 'an',
    'biographical': 'b',
    'cartoon': 'c',
    'comedy': 'com',
    'crime': 'cr',
    'documentary': 'd',
    'drama': 'dr',
    'family': 'f',
    'historical': 'h',
    'horror': 'hor',
    'inspiration': 'i',
    'martial-arts': 'ma',
    'musical': 'm',
    'mystery': 'my',
    'news': 'n',
    'romance': 'r',
    'sci-fi': 'sf',
    'sport': 's',
    'thriller': 't',
    'war': 'w',
    'western': 'we',
    'tv-series': 'tv'
  };
  
  const genreKey = genre.toLowerCase().replace(/\s+/g, '-');
  return genreMapping[genreKey] || 'mov';
}

// Function to check if a movie already exists
async function movieExists(title, genre) {
  const moviesRef = collection(db, 'movies');
  const q = query(moviesRef, where('title', '==', title), where('genre', '==', genre));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

// Function to migrate a single movie
async function migrateMovie(movie, genreCategory) {
  try {
    // Check if movie already exists
    const exists = await movieExists(movie.title, genreCategory);
    if (exists) {
      console.log(`⏭️  Skipping "${movie.title}" - already exists`);
      return { success: true, skipped: true };
    }

    // Prepare movie document
    const movieDoc = {
      // Use existing ID or generate new one
      id: movie.id || `${getGenreIdPrefix(genreCategory)}${Date.now()}${Math.floor(Math.random() * 1000)}`,
      title: movie.title,
      description: movie.description || '',
      genre: genreCategory,
      year: movie.year || '',
      duration: movie.duration || '',
      rating: movie.rating || '',
      videoUrl: movie.videoUrl || '',
      slug: movie.slug || movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      
      // Image URLs - these will be replaced with ImageKit URLs later
      image: movie.image || '', // Portrait image
      innerImage: movie.innerImage || '', // Landscape image
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      migratedFromJson: true
    };

    // Add to Firestore
    const docRef = await addDoc(collection(db, 'movies'), movieDoc);
    console.log(`✅ Migrated "${movie.title}" with ID: ${docRef.id}`);
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error(`❌ Error migrating "${movie.title}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Main migration function
async function migrateAllMovies() {
  console.log('🚀 Starting movie migration...\n');
  
  try {
    // Read movies.json
    const moviesPath = join(__dirname, '..', 'src', 'data', 'movies.json');
    const moviesData = JSON.parse(readFileSync(moviesPath, 'utf-8'));
    
    let totalMovies = 0;
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Count total movies
    for (const genre in moviesData) {
      totalMovies += moviesData[genre].length;
    }
    
    console.log(`📊 Found ${totalMovies} movies to migrate\n`);
    
    // Migrate movies by genre
    for (const genre in moviesData) {
      console.log(`\n📂 Processing ${genre} movies (${moviesData[genre].length} items):`);
      
      for (const movie of moviesData[genre]) {
        const result = await migrateMovie(movie, genre);
        
        if (result.success) {
          if (result.skipped) {
            skippedCount++;
          } else {
            successCount++;
          }
        } else {
          errorCount++;
        }
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Read and migrate extra movies
    console.log('\n📂 Processing extra movies:');
    const extraMoviesPath = join(__dirname, '..', 'src', 'data', 'extraMovie.json');
    
    try {
      const extraMoviesData = JSON.parse(readFileSync(extraMoviesPath, 'utf-8'));
      
      for (const genre in extraMoviesData) {
        console.log(`\n  📁 ${genre} (${extraMoviesData[genre].length} items):`);
        
        for (const movie of extraMoviesData[genre]) {
          const result = await migrateMovie(movie, genre);
          
          if (result.success) {
            if (result.skipped) {
              skippedCount++;
            } else {
              successCount++;
            }
          } else {
            errorCount++;
          }
          
          totalMovies++;
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.log('⚠️  No extra movies file found or error reading it');
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${totalMovies}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ Migration completed!');
    
    if (successCount > 0) {
      console.log('\n💡 Next steps:');
      console.log('1. The movies have been migrated with local image paths');
      console.log('2. You can now upload the images to ImageKit through the dashboard');
      console.log('3. The system will automatically update the image URLs when you upload new images');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during migration:', error);
  }
  
  process.exit(0);
}

// Run the migration
console.log('='.repeat(50));
console.log('🎬 Movie Database Migration Tool');
console.log('='.repeat(50));
console.log('\nThis script will migrate your JSON movie data to Firebase.');
console.log('Existing movies will be skipped to avoid duplicates.\n');

// Add a confirmation prompt
console.log('Press Ctrl+C to cancel or wait 3 seconds to continue...\n');

setTimeout(() => {
  migrateAllMovies();
}, 3000);
