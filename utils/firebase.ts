
// Import the functions you need from the SDKs you need
import * as firebaseApp from "firebase/app"; // Changed to namespace import
import { getAnalytics } from "firebase/analytics"; // Corrected for v9+
// Removed: import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAzmykjgxRu-roSdIRm7R-85XVQOhAMloc",
  authDomain: "porto-code-47a47.firebaseapp.com",
  projectId: "porto-code-47a47",
  storageBucket: "porto-code-47a47.firebasestorage.app",
  messagingSenderId: "1044362730097",
  appId: "1:1044362730097:web:17b21003bcad31e9f959d0",
  measurementId: "G-42WH83DCM7"
};

// Initialize Firebase
const app = firebaseApp.initializeApp(firebaseConfig); // Call initializeApp via the namespace
const analytics = getAnalytics(app); // Corrected for v9+

// Removed App Check related constants and initialization logic.
// export let RECAPTCHA_SITE_KEY_IS_PLACEHOLDER = false; // Removed

export { app, analytics };