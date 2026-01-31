// Firebase Configuration
// ==============================================
// HOW TO SET UP:
// 1. Go to https://console.firebase.google.com/
// 2. Click "Create a project" (or "Add project")
// 3. Name it "school-bus-tracking" (or any name)
// 4. Disable Google Analytics (optional for hackathon)
// 5. Click "Create project"
// 6. Click the </> (Web) icon to add a web app
// 7. Register app name: "bus-dashboard"
// 8. Copy the firebaseConfig values below
// 9. Go to Firestore Database > Create database > Start in test mode
// 10. Go to Authentication > Get started > Enable Anonymous provider
// ==============================================

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBbUov44CfuEzUERI9aQwGm8fy06el6z-0",
  authDomain: "bus-tracking-363b8.firebaseapp.com",
  projectId: "bus-tracking-363b8",
  storageBucket: "bus-tracking-363b8.firebasestorage.app",
  messagingSenderId: "811005481984",
  appId: "1:811005481984:web:b96a65582689a2f569f4e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

export default app;
