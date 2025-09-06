const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');
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

// Function to update TV series data
async function updateTvSeriesData() {
  console.log('🚀 Starting TV series data update...\n');
  
  try {
    // Read tvEpisodes.json
    const tvEpisodesPath = join(__dirname, '..', 'src', 'data', 'tvEpisodes.json');
    const tvEpisodesData = JSON.parse(readFileSync(tvEpisodesPath, 'utf-8'));
    
    // Get all TV series from Firebase
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'tv-series'));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 Found ${querySnapshot.size} TV series in database\n`);
    
    let updatedCount = 0;
    let errorCount = 0;
    
    // Process each TV series
    for (const docSnap of querySnapshot.docs) {
      const seriesData = docSnap.data();
      const docId = docSnap.id;
      
      console.log(`\n📺 Processing: ${seriesData.title}`);
      console.log('='.repeat(50));
      
      try {
        // Find matching episode data
        let episodeData = null;
        let matchingSlug = null;
        
        // Try to find by slug
        for (const [slug, data] of Object.entries(tvEpisodesData)) {
          if (data.title === seriesData.title || slug === seriesData.slug) {
            episodeData = data;
            matchingSlug = slug;
            break;
          }
        }
        
        if (!episodeData) {
          console.log(`⚠️  No episode data found for "${seriesData.title}"`);
          continue;
        }
        
        // Update image URLs to use /series/ folder
        const filename = seriesData.image?.split('/').pop() || `series${seriesData.id.substring(2)}.jpg`;
        const portraitUrl = `${IMAGEKIT_URL_ENDPOINT}/series/${filename}`;
        const landscapeUrl = `${IMAGEKIT_URL_ENDPOINT}/series/landscape/${filename.replace('.jpg', '_inner.jpg')}`;
        
        // Prepare update data
        const updateData = {
          // Update image URLs
          image: portraitUrl,
          innerImage: landscapeUrl,
          
          // Add episode data
          episodes: episodeData.episodes.map(ep => ({
            id: ep.id,
            title: ep.title,
            slug: ep.slug,
            description: ep.description,
            videoUrl: ep.videoUrl,
            duration: ep.duration,
            previousEpisode: ep.previousEpisode,
            nextEpisode: ep.nextEpisode
          })),
          episodeCount: episodeData.episodes.length,
          
          // Update slug to match episode data
          slug: matchingSlug,
          
          // Update metadata
          updatedAt: new Date(),
          episodesAdded: true
        };
        
        // Update the document
        const docRef = doc(db, 'movies', docId);
        await updateDoc(docRef, updateData);
        
        console.log(`✅ Updated successfully`);
        console.log(`   Portrait: ${portraitUrl}`);
        console.log(`   Landscape: ${landscapeUrl}`);
        console.log(`   Episodes: ${episodeData.episodes.length}`);
        
        updatedCount++;
      } catch (error) {
        console.error(`❌ Error updating: ${error.message}`);
        errorCount++;
      }
      
      // Add a small delay
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Update Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Successfully updated: ${updatedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${querySnapshot.size}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ TV Series update completed!');
    
  } catch (error) {
    console.error('❌ Fatal error during update:', error);
  }
  
  process.exit(0);
}

// Run the update
console.log('='.repeat(50));
console.log('📺 TV Series Data Update Tool');
console.log('='.repeat(50));
console.log('\nThis script will:');
console.log('1. Update TV series images to use /series/ folder');
console.log('2. Add episode data from tvEpisodes.json');
console.log('3. Fix any missing metadata\n');

// Start the update
updateTvSeriesData();
