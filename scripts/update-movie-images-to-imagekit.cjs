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

// Function to convert local path to ImageKit URL
function convertToImageKitUrl(localPath, genre) {
  if (!localPath || localPath.startsWith('http')) {
    // Already a URL or empty
    return localPath;
  }
  
  // Extract just the filename from the path
  const filename = localPath.split('/').pop();
  
  // Check if it's a landscape image (if the path contains 'landscape' folder)
  const isLandscape = localPath.includes('/landscape/');
  
  // Build the ImageKit URL based on your folder structure
  if (isLandscape) {
    return `${IMAGEKIT_URL_ENDPOINT}/movies/${genre}/landscape/${filename}`;
  } else {
    return `${IMAGEKIT_URL_ENDPOINT}/movies/${genre}/${filename}`;
  }
}

// Function to update a single movie's image URLs
async function updateMovieImages(movieId, docData) {
  try {
    const updates = {};
    let hasChanges = false;
    
    // Get the genre for building the correct ImageKit path
    const genre = docData.genre || 'movies';
    
    // Check and update portrait image
    if (docData.image && !docData.image.startsWith('http')) {
      updates.image = convertToImageKitUrl(docData.image, genre);
      hasChanges = true;
    }
    
    // Check and update landscape image
    if (docData.innerImage && !docData.innerImage.startsWith('http')) {
      updates.innerImage = convertToImageKitUrl(docData.innerImage, genre);
      hasChanges = true;
    }
    
    // Only update if there are changes
    if (hasChanges) {
      const movieRef = doc(db, 'movies', movieId);
      await updateDoc(movieRef, {
        ...updates,
        updatedAt: new Date(),
        imagesUpdatedToImageKit: true
      });
      
      console.log(`✅ Updated "${docData.title}"`);
      if (updates.image) console.log(`   Portrait: ${updates.image}`);
      if (updates.innerImage) console.log(`   Landscape: ${updates.innerImage}`);
      
      return { success: true, updated: true };
    } else {
      console.log(`⏭️  Skipping "${docData.title}" - already using ImageKit URLs`);
      return { success: true, updated: false };
    }
    
  } catch (error) {
    console.error(`❌ Error updating "${docData.title}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Main function to update all movies
async function updateAllMovieImages() {
  console.log('🚀 Starting image URL update...\n');
  
  try {
    // Fetch all movies
    const moviesRef = collection(db, 'movies');
    const querySnapshot = await getDocs(moviesRef);
    
    let totalMovies = querySnapshot.size;
    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    
    console.log(`📊 Found ${totalMovies} movies to check\n`);
    
    // Process each movie
    for (const movieDoc of querySnapshot.docs) {
      const movieData = movieDoc.data();
      const result = await updateMovieImages(movieDoc.id, movieData);
      
      if (result.success) {
        if (result.updated) {
          updatedCount++;
        } else {
          skippedCount++;
        }
      } else {
        errorCount++;
      }
      
      // Add a small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Update Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Updated: ${updatedCount} movies`);
    console.log(`⏭️  Skipped (already using ImageKit): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${totalMovies}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ Image URL update completed!');
    
    if (updatedCount > 0) {
      console.log('\n💡 Next steps:');
      console.log('1. Your movies are now using ImageKit URLs');
      console.log('2. The images will load faster with ImageKit\'s CDN');
      console.log('3. You can use the dashboard to upload new movies with images');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during update:', error);
  }
  
  process.exit(0);
}

// Run the update
console.log('='.repeat(50));
console.log('🎬 Movie Image URL Update Tool');
console.log('='.repeat(50));
console.log('\nThis script will update your movie image URLs to use ImageKit.');
console.log('Local paths will be converted to ImageKit URLs.\n');

// Start the update
updateAllMovieImages();
