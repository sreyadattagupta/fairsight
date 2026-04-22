import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD8jc7M6DTTksDSD-h0iezGfXeYf5xb8Ps",
  authDomain: "fairsigh.firebaseapp.com",
  projectId: "fairsigh",
  storageBucket: "fairsigh.firebasestorage.app",
  messagingSenderId: "604691643704",
  appId: "1:604691643704:web:2dfcd1e793cde7895355cd",
  measurementId: "G-1Y9FP3HBSM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);