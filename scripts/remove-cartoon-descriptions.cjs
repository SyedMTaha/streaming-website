const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc, query, where } = require('firebase/firestore');

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

// Descriptions to remove
const descriptionsToRemove = [
  "Atom Ant's first adventure where he discovers his superpowers and helps the local community.",
  "Atom Ant must rescue a group of trapped miners from a collapsed tunnel."
];

async function removeDescriptions() {
  console.log('🔍 Starting to remove specific episode descriptions...\n');
  
  try {
    // Get all cartoons
    const moviesRef = collection(db, 'movies');
    const q = query(moviesRef, where('genre', '==', 'cartoon'));
    const querySnapshot = await getDocs(q);
    
    console.log(`📊 Found ${querySnapshot.size} cartoons in database\n`);
    
    let updatedCount = 0;
    let episodesUpdated = 0;
    
    // Process each cartoon
    for (const docSnap of querySnapshot.docs) {
      const cartoonData = docSnap.data();
      const docId = docSnap.id;
      let needsUpdate = false;
      
      console.log(`\n🎨 Checking: ${cartoonData.title}`);
      
      if (cartoonData.episodes && Array.isArray(cartoonData.episodes)) {
        const updatedEpisodes = cartoonData.episodes.map(episode => {
          if (descriptionsToRemove.includes(episode.description)) {
            needsUpdate = true;
            episodesUpdated++;
            console.log(`  ❌ Removing description from: ${episode.title}`);
            // Remove the description or replace with empty string
            return { ...episode, description: '' };
          }
          return episode;
        });
        
        if (needsUpdate) {
          // Update the document
          const docRef = doc(db, 'movies', docId);
          await updateDoc(docRef, {
            episodes: updatedEpisodes,
            updatedAt: new Date()
          });
          
          updatedCount++;
          console.log(`  ✅ Updated ${cartoonData.title}`);
        } else {
          console.log(`  ✓ No matching descriptions found`);
        }
      } else {
        console.log(`  ⚠️ No episodes found`);
      }
      
      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📈 Update Summary:');
    console.log('='.repeat(50));
    console.log(`✅ Cartoons updated: ${updatedCount}`);
    console.log(`📝 Episode descriptions removed: ${episodesUpdated}`);
    console.log(`📊 Total cartoons processed: ${querySnapshot.size}`);
    console.log('='.repeat(50));
    
    console.log('\n✨ Description removal completed!');
    
  } catch (error) {
    console.error('❌ Error during update:', error);
  }
  
  process.exit(0);
}

// Run the update
console.log('='.repeat(50));
console.log('🧹 Cartoon Episode Description Removal Tool');
console.log('='.repeat(50));
console.log('\nThis script will remove the following descriptions:');
descriptionsToRemove.forEach((desc, index) => {
  console.log(`${index + 1}. "${desc}"`);
});
console.log('\n');

// Ask for confirmation
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Do you want to proceed? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    rl.close();
    removeDescriptions();
  } else {
    console.log('Operation cancelled.');
    rl.close();
    process.exit(0);
  }
});
