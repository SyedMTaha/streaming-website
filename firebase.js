// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Validate Firebase configuration
if (!firebaseConfig.apiKey) {
  throw new Error('Firebase API Key is missing. Please check your environment variables.');
}

if (!firebaseConfig.projectId) {
  throw new Error('Firebase Project ID is missing. Please check your environment variables.');
}

// Debug log
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'exists' : 'missing',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'exists' : 'missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'exists' : 'missing',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'exists' : 'missing',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'exists' : 'missing',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'exists' : 'missing',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ? 'exists' : 'missing'
});

// Initialize Firebase
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw error;
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;


async function getUserData(userId) {  // Changed from userID to userId
    try {
        const userRef = doc(db, 'users', userId);
        const userSnap = await getDoc(userRef);
    
        if (userSnap.exists()) {
            const userData = userSnap.data();
            console.log('User Category:', userData.signUpAs);
            console.log('User Data:', userData);
            return { success: true, data: userData };
        } else {
            console.log('No such user!');
            return { success: false, error: 'User not found' };
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        return { success: false, error };
    }
}

const storeUserData = async (userData) => {
  try {
    // Store user data in Firestore
    await setDoc(doc(db, "users", userData.uid), userData);
    return { success: true };
  } catch (error) {
    console.error("Error storing user data:", error);
    return { success: false, error };
  }
};

  export { auth, db, storage, analytics, storeUserData, getUserData };
