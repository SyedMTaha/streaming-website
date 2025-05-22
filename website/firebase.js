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
  apiKey: "AIzaSyBYpNwKhRGk8wvZoA5YytI87fG5g8Dy7q4",
  authDomain: "streaming-website-fe2fd.firebaseapp.com",
  projectId: "streaming-website-fe2fd",
  storageBucket: "streaming-website-fe2fd.firebasestorage.app",
  messagingSenderId: "336587356779",
  appId: "1:336587356779:web:41dc6d4722732dec890f2e",
  measurementId: "G-4V050W2D1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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
