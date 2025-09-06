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

// Mapping of cartoon titles to their episode data keys
const cartoonMapping = {
  'Atom Ant': 'atom-ant',
  'High Lander': 'high-lander',
  'Hong Kong Phoey': 'hong-kong-phoey',
  'Young Samsons Goliath': 'young-samsons-goliath',
  'Superman': 'superman',
  'Barney Bear': 'barney-bear',
  'Tom and Jerry Comedy Show': 'tom-and-jerry-comedy-show',
  'Top Cat': 'top-cat',
  'Yogi Bear': 'yogi-bear',
  'Lippy the Lion Hardy Har Har': 'lippy-the-lion-hardy-har-har',
  'Precious Pupp': 'precious-pupp',
  'Sealab': 'sealab',
  'Quick Draw Mcgraw': 'quick-draw',
  'Jetsons': 'jetsons',
  'Steamboat Willie': 'steamboat-willie',
  'Jonny Quest': 'jonny-quest',
  'The Great Grape Ape Show': 'the-great-grape-ape-show',
  // These don't have episode data
  'The New Fantastic Four': 'the-new-fantastic-four',
  'Jeannie': 'jeannie'
};

// Function to update cartoon series data
async function updateCartoonData() {
  console.log('🚀 Starting cartoon series data update...\n');
  
  try {
    // Read cartoonEpisodes.json
    const cartoonEpisodesPath = join(__dirname, '..', 'src', 'data', 'cartoonEpisodes.json');
    const cartoonEpisodesData = JSON.parse(readFileSync(cartoonEpisodesPath, 'utf-8'));
    
    // Get all cartoons from Firebase
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'cartoon'));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 Found ${querySnapshot.size} cartoon series in database\n`);
    
    let updatedCount = 0;
    let errorCount = 0;
    let noEpisodeDataCount = 0;
    
    // Process each cartoon
    for (const docSnap of querySnapshot.docs) {
      const cartoonData = docSnap.data();
      const docId = docSnap.id;
      
      console.log(`\n🎨 Processing: ${cartoonData.title}`);
      console.log('='.repeat(50));
      
      try {
        // Find matching episode data
        const episodeKey = cartoonMapping[cartoonData.title] || cartoonData.slug;
        const episodeData = cartoonEpisodesData[episodeKey];
        
        if (!episodeData || !episodeData.episodes) {
          console.log(`⚠️  No episode data found for "${cartoonData.title}"`);
          noEpisodeDataCount++;
          
          // Still update the image URLs to use correct folder
          const filename = cartoonData.image?.split('/').pop() || `cartoon${cartoonData.id.substring(1)}.jpg`;
          const portraitUrl = `${IMAGEKIT_URL_ENDPOINT}/cartoons/${filename}`;
          const landscapeUrl = `${IMAGEKIT_URL_ENDPOINT}/cartoons/landscape/${filename.replace('.jpg', '_inner.jpg').replace('.png', '_inner.png').replace('.jpeg', '_inner.jpeg')}`;
          
          const updateData = {
            image: portraitUrl,
            innerImage: landscapeUrl,
            updatedAt: new Date()
          };
          
          const docRef = doc(db, 'movies', docId);
          await updateDoc(docRef, updateData);
          
          console.log(`✅ Updated image URLs only`);
          console.log(`   Portrait: ${portraitUrl}`);
          console.log(`   Landscape: ${landscapeUrl}`);
          
          updatedCount++;
          continue;
        }
        
        // Update image URLs to use correct folder structure
        const filename = cartoonData.image?.split('/').pop() || episodeData.episodes[0].thumbnail.split('/').pop();
        const portraitUrl = `${IMAGEKIT_URL_ENDPOINT}/cartoons/${filename}`;
        const landscapeUrl = `${IMAGEKIT_URL_ENDPOINT}/cartoons/landscape/${filename.replace('.jpg', '_inner.jpg').replace('.png', '_inner.png').replace('.jpeg', '_inner.jpeg')}`;
        
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
            description: ep.description || ep[''] || `${cartoonData.title} - ${ep.title}`,
            videoUrl: ep.videoUrl,
            duration: ep.duration,
            thumbnail: ep.thumbnail || cartoonData.image,
            previousEpisode: ep.previousEpisode,
            nextEpisode: ep.nextEpisode
          })),
          episodeCount: episodeData.episodes.length,
          
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
    console.log(`⚠️  No episode data found: ${noEpisodeDataCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📊 Total processed: ${querySnapshot.size}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ Cartoon series update completed!');
    
    if (noEpisodeDataCount > 0) {
      console.log('\n💡 Note: Some cartoons only had their image URLs updated');
      console.log('because episode data was not found in cartoonEpisodes.json');
    }
    
  } catch (error) {
    console.error('❌ Fatal error during update:', error);
  }
  
  process.exit(0);
}

// Run the update
console.log('='.repeat(50));
console.log('🎨 Cartoon Series Data Update Tool');
console.log('='.repeat(50));
console.log('\nThis script will:');
console.log('1. Update cartoon images to use /cartoons/ folder');
console.log('2. Add episode data from cartoonEpisodes.json');
console.log('3. Fix any missing metadata\n');

// Start the update
updateCartoonData();
