

// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'; // Use compat for initializeApp
import 'firebase/compat/analytics'; // Import analytics for side effects (compat)

import { 
  getAuth, 
  GoogleAuthProvider, 
  GithubAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser // Alias User to FirebaseUser to avoid potential conflicts
} from "firebase/auth"; // Changed to direct import (remains modular)
import { 
  getFirestore, 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp
} from "firebase/firestore"; // Changed to direct import (remains modular)
import { 
  getDatabase, 
  ref, 
  onValue,
  set, // Added set for overwriting data
  update, // Keep update if used elsewhere or for partial updates
  increment, // Added increment for atomic counters
  get // Added get for fetching data once
} from "firebase/database"; // Added Realtime Database imports


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzmykjgxRu-roSdIRm7R-85XVQOhAMloc",
  authDomain: "porto-code-47a47.firebaseapp.com",
  projectId: "porto-code-47a47",
  storageBucket: "porto-code-47a47.firebasestorage.app",
  messagingSenderId: "1044362730097",
  appId: "1:1044362730097:web:17b21003bcad31e9f959d0",
  measurementId: "G-42WH83DCM7",
  databaseURL: "https://porto-code-47a47-default-rtdb.asia-southeast1.firebasedatabase.app/" // Added Database URL
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig); // Use compat initializeApp
const analytics = firebase.analytics(); // Use compat analytics (uses default app)
const auth = getAuth(app); // Modular auth, initialized with the (compat) app instance
const db = getFirestore(app); // Modular firestore, initialized with the (compat) app instance
const database = getDatabase(app); // Initialize Realtime Database

export { 
  app, 
  analytics, 
  auth, // Export auth instance
  db,   // Export Firestore instance
  database, // Export Realtime Database instance
  // Auth functions
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  // Firestore functions
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  // Realtime Database functions
  ref,
  onValue,
  set, 
  update, 
  increment,
  get // Export get
};
export type { FirebaseUser }; // Export FirebaseUser type