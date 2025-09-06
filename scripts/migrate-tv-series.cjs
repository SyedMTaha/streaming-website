const { initializeApp } = require('firebase/app');
const { getFirestore, collection, doc, setDoc, getDocs, query, where } = require('firebase/firestore');
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

// Function to convert series image path to ImageKit URL
function convertToImageKitUrl(localPath, isLandscape) {
  if (!localPath) return '';
  
  // Extract just the filename from the path
  const filename = localPath.split('/').pop();
  
  // For TV series, use /series/ folder structure
  if (isLandscape) {
    return `${IMAGEKIT_URL_ENDPOINT}/series/landscape/${filename}`;
  } else {
    return `${IMAGEKIT_URL_ENDPOINT}/series/${filename}`;
  }
}

// Function to get the next TV series ID
async function getNextSeriesId() {
  const moviesRef = collection(db, 'movies');
  const q = query(moviesRef, where('genre', '==', 'tv-series'));
  const querySnapshot = await getDocs(q);
  
  let maxNumber = 0;
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.id && data.id.startsWith('tv')) {
      const numberPart = data.id.substring(2);
      const num = parseInt(numberPart, 10);
      if (!isNaN(num) && num > maxNumber) {
        maxNumber = num;
      }
    }
  });
  
  return `tv${maxNumber + 1}`;
}

// Function to migrate a single TV series
async function migrateSeries(seriesSlug, seriesData) {
  try {
    // Check if series already exists
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('slug', '==', seriesSlug));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      console.log(`⏭️  Skipping "${seriesData.title}" - already exists`);
      return { success: true, skipped: true };
    }
    
    // Get next series ID
    const seriesId = await getNextSeriesId();
    
    // Convert image paths to ImageKit URLs
    const portraitUrl = convertToImageKitUrl(seriesData.thumbnail, false);
    // For landscape, we'll use the same image but from landscape folder
    const landscapeUrl = convertToImageKitUrl(seriesData.thumbnail.replace('.jpg', '_inner.jpg'), true);
    
    // Prepare series document (similar to movie structure)
    const seriesDoc = {
      id: seriesId,
      title: seriesData.title,
      description: seriesData.description || '',
      genre: 'tv-series',
      year: '', // Add year if available in your data
      duration: seriesData.duration || '',
      rating: seriesData.rating || '',
      videoUrl: '', // TV series don't have a single video URL
      slug: seriesSlug,
      
      // ImageKit URLs
      image: portraitUrl, // Portrait image
      innerImage: landscapeUrl, // Landscape image
      
      // Episodes data
      episodes: seriesData.episodes.map(ep => ({
        id: ep.id,
        title: ep.title,
        slug: ep.slug,
        description: ep.description,
        videoUrl: ep.videoUrl,
        duration: ep.duration,
        previousEpisode: ep.previousEpisode,
        nextEpisode: ep.nextEpisode
      })),
      episodeCount: seriesData.episodes.length,
      
      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
      migratedFromJson: true
    };
    
    // Use setDoc with the specific document ID
    const docRef = doc(db, 'movies', seriesId);
    await setDoc(docRef, seriesDoc);
    
    console.log(`✅ Migrated "${seriesData.title}" with ID: ${seriesId}`);
    console.log(`   Portrait: ${portraitUrl}`);
    console.log(`   Landscape: ${landscapeUrl}`);
    console.log(`   Episodes: ${seriesData.episodes.length}`);
    
    return { success: true, id: seriesId };
  } catch (error) {
    console.error(`❌ Error migrating "${seriesData.title}":`, error.message);
    return { success: false, error: error.message };
  }
}

// Main migration function
async function migrateAllTvSeries() {
  console.log('🚀 Starting TV series migration...\n');
  
  try {
    // Read tvEpisodes.json
    const tvEpisodesPath = join(__dirname, '..', 'src', 'data', 'tvEpisodes.json');
    const tvEpisodesData = JSON.parse(readFileSync(tvEpisodesPath, 'utf-8'));
    
    const seriesSlugs = Object.keys(tvEpisodesData);
    let totalSeries = seriesSlugs.length;
    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    console.log(`📊 Found ${totalSeries} TV series to migrate\n`);
    
    // Migrate each series
    for (const slug of seriesSlugs) {
      const series = tvEpisodesData[slug];
      console.log(`\n📺 Processing: ${series.title}`);
      console.log('='.repeat(50));
      
      const result = await migrateSeries(slug, series);
      
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
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully migrated: ${successCount}`);
    console.log(`⏭️  Skipped (already exist): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${totalSeries}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ TV Series migration completed!');
    
    if (successCount > 0) {
      console.log('\n💡 Important notes:');
      console.log('1. TV series have been imported with ImageKit URLs');
      console.log('2. Portrait images: https://ik.imagekit.io/epnaccvj6/series/[filename]');
      console.log('3. Landscape images: https://ik.imagekit.io/epnaccvj6/series/landscape/[filename]');
      console.log('4. Episodes are stored in the episodes array');
      console.log('5. You can now upload new TV series through the dashboard');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during migration:', error);
  }
  
  process.exit(0);
}

// Run the migration
console.log('='.repeat(50));
console.log('📺 TV Series Database Migration Tool');
console.log('='.repeat(50));
console.log('\nThis script will migrate your TV series data to Firebase');
console.log('with correct ImageKit URLs from the /series/ folder.\n');
console.log('ImageKit URL structure:');
console.log('- Portrait: /series/[filename]');
console.log('- Landscape: /series/landscape/[filename]\n');

// Add a confirmation prompt
console.log('Press Ctrl+C to cancel or wait 3 seconds to continue...\n');

setTimeout(() => {
  migrateAllTvSeries();
}, 3000);
