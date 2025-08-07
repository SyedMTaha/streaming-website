// import fs from 'fs';
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
// import dotenv from 'dotenv';

// // Load environment variables from .env.local
// dotenv.config({ path: '.env.local' });

// // Load environment variables
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // Function to upload data to Firestore
// const uploadData = async (collectionName, data) => {
//   try {
//     // If data is an array, upload each item as a separate document
//     if (Array.isArray(data)) {
//       for (let i = 0; i < data.length; i++) {
//         const docRef = doc(collection(db, collectionName));
//         await setDoc(docRef, data[i]);
//         console.log(`Uploaded ${collectionName} document ${i + 1}/${data.length}`);
//       }
//     } else {
//       // If data is an object, upload as a single document
//       const docRef = doc(collection(db, collectionName));
//       await setDoc(docRef, data);
//     }
//     console.log(`${collectionName} data uploaded successfully!`);
//   } catch (error) {
//     console.error(`Error uploading ${collectionName} data:`, error);
//   }
// };

// // Main function to run the upload
// const main = async () => {
//   try {
//     // Read JSON files
//     console.log('Reading JSON files...');
//     const movies = JSON.parse(fs.readFileSync('src/data/movies.json', 'utf8'));
//     const cartoons = JSON.parse(fs.readFileSync('src/data/cartoonEpisodes.json', 'utf8'));
//     const tvSeries = JSON.parse(fs.readFileSync('src/data/tvEpisodes.json', 'utf8'));

//     console.log('Starting upload to Firebase...');
    
//     // Upload data sequentially
//     await uploadData('movies', movies);
//     await uploadData('cartoons', cartoons);
//     await uploadData('tvSeries', tvSeries);
    
//     console.log('All data uploaded successfully!');
//   } catch (error) {
//     console.error('Error in main function:', error);
//   }
// };

// // Run the main function
// main();
