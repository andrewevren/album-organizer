// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBDYSgbXohBeSEbWzURnMOoNPDhtsegbR4",
  authDomain: "album-organizer.firebaseapp.com",
  projectId: "album-organizer",
  storageBucket: "album-organizer.appspot.com",
  messagingSenderId: "1001217762295",
  appId: "1:1001217762295:web:9c718147e96f33e38cc4f2",
  measurementId: "G-E9929WM0DR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);