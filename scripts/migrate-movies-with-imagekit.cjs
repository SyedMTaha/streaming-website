const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs } = require('firebase/firestore');
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

// ImageKit URL endpoint
const IMAGEKIT_URL_ENDPOINT = 'https://ik.imagekit.io/epnaccvj6';

// Function to convert local path to ImageKit URL
function convertToImageKitUrl(localPath, genre, isLandscape) {
  if (!localPath) return '';
  
  // Extract just the filename from the path
  const filename = localPath.split('/').pop();
  
  // Build the ImageKit URL based on your folder structure
  if (isLandscape) {
    return `${IMAGEKIT_URL_ENDPOINT}/movies/${genre}/landscape/${filename}`;
  } else {
    return `${IMAGEKIT_URL_ENDPOINT}/movies/${genre}/${filename}`;
  }
}

// Function to generate a consistent document ID
function generateDocumentId(movie, genre) {
  // Use the original ID if it exists
  if (movie.id) {
    return movie.id;
  }
  
  // Otherwise generate one based on title and genre
  const titleSlug = movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 20);
  return `${genre}-${titleSlug}-${Date.now()}`;
}

// Function to migrate a single movie
async function migrateMovie(movie, genreCategory) {
  try {
    // Generate consistent document ID
    const docId = generateDocumentId(movie, genreCategory);
    
    // Convert image paths to ImageKit URLs
    const portraitUrl = convertToImageKitUrl(movie.image, genreCategory, false);
    const landscapeUrl = convertToImageKitUrl(movie.innerImage, genreCategory, true);
    
    // Prepare movie document
    const movieDoc = {
      // Keep the original ID for reference
      id: movie.id || docId,
      title: movie.title,
      description: movie.description || '',
      genre: genreCategory,
      year: movie.year || '',
      duration: movie.duration || '',
      rating: movie.rating || '',
      videoUrl: movie.videoUrl || '',
      slug: movie.slug || movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
      
      // ImageKit URLs
      image: portraitUrl, // Portrait image
      innerImage: landscapeUrl, // Landscape image
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      migratedFromJson: true,
      originalJsonId: movie.id || null
    };

    // Use setDoc with the specific document ID to ensure consistency
    const movieRef = doc(db, 'movies', docId);
    await setDoc(movieRef, movieDoc);
    
    console.log(`✅ Migrated "${movie.title}" with ID: ${docId}`);
    console.log(`   Portrait: ${portraitUrl}`);
    console.log(`   Landscape: ${landscapeUrl}`);
    
    return { success: true, id: docId };
  } catch (error) {
    console.error(`❌ Error migrating "${movie.title}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Main migration function
async function migrateAllMovies() {
  console.log('🚀 Starting movie migration with ImageKit URLs...\n');
  
  try {
    // Check if collection already has data
    const moviesSnapshot = await getDocs(collection(db, 'movies'));
    if (!moviesSnapshot.empty) {
      console.log('⚠️  Movies collection already contains data!');
      console.log('Please delete the collection first or use a different script.\n');
      process.exit(1);
    }
    
    // Read movies.json
    const moviesPath = join(__dirname, '..', 'src', 'data', 'movies.json');
    const moviesData = JSON.parse(readFileSync(moviesPath, 'utf-8'));
    
    let totalMovies = 0;
    let successCount = 0;
    let errorCount = 0;
    
    // Count total movies
    for (const genre in moviesData) {
      totalMovies += moviesData[genre].length;
    }
    
    console.log(`📊 Found ${totalMovies} movies to migrate\n`);
    
    // Migrate movies by genre
    for (const genre in moviesData) {
      console.log(`\n📂 Processing ${genre} movies (${moviesData[genre].length} items):`);
      console.log('='.repeat(50));
      
      for (const movie of moviesData[genre]) {
        const result = await migrateMovie(movie, genre);
        
        if (result.success) {
          successCount++;
        } else {
          errorCount++;
        }
        
        // Add a small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Read and migrate extra movies
    console.log('\n\n📂 Processing extra movies:');
    console.log('='.repeat(50));
    const extraMoviesPath = join(__dirname, '..', 'src', 'data', 'extraMovie.json');
    
    try {
      const extraMoviesData = JSON.parse(readFileSync(extraMoviesPath, 'utf-8'));
      
      for (const genre in extraMoviesData) {
        console.log(`\n📁 ${genre} (${extraMoviesData[genre].length} items):`);
        
        for (const movie of extraMoviesData[genre]) {
          const result = await migrateMovie(movie, genre);
          
          if (result.success) {
            successCount++;
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
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${totalMovies}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ Migration completed!');
    console.log('\n💡 Important notes:');
    console.log('1. All movies have been imported with correct ImageKit URLs');
    console.log('2. Portrait images: https://ik.imagekit.io/epnaccvj6/movies/[genre]/[filename]');
    console.log('3. Landscape images: https://ik.imagekit.io/epnaccvj6/movies/[genre]/landscape/[filename]');
    console.log('4. Document IDs are based on the original movie IDs from JSON for consistency');
    console.log('5. Movies are properly categorized by genre');
    
  } catch (error) {
    console.error('❌ Fatal error during migration:', error);
  }
  
  process.exit(0);
}

// Run the migration
console.log('='.repeat(50));
console.log('🎬 Movie Database Migration Tool (with ImageKit)');
console.log('='.repeat(50));
console.log('\nThis script will migrate your JSON movie data to Firebase');
console.log('with correct ImageKit URLs from the start.\n');
console.log('ImageKit URL structure:');
console.log('- Portrait: /movies/[genre]/[filename]');
console.log('- Landscape: /movies/[genre]/landscape/[filename]\n');

// Add a confirmation prompt
console.log('Press Ctrl+C to cancel or wait 3 seconds to continue...\n');

setTimeout(() => {
  migrateAllMovies();
}, 3000);
