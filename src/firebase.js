// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDMjPmbaxDjLQM5DPqnla4qTF1jmIQExCQ",
  authDomain: "fitness-app-82f75.firebaseapp.com",
  projectId: "fitness-app-82f75",
  storageBucket: "fitness-app-82f75.firebasestorage.app",
  messagingSenderId: "986270622328",
  appId: "1:986270622328:web:0cd439508356b6c75f038d",
  measurementId: "G-D2PYC39R0Z",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
// Google Provider
export const googleProvider = new GoogleAuthProvider();
