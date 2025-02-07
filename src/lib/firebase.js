import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBFm1RePYalFYl5vmCk9vRZOKqxpIidijM",
  authDomain: "react-messenger-66418.firebaseapp.com",
  projectId: "react-messenger-66418",
  storageBucket: "react-messenger-66418.firebasestorage.app",
  messagingSenderId: "276246442975",
  appId: "1:276246442975:web:2d64f2acb2d3665e894a6a",
  measurementId: "G-7129T2NBXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const db = getFirestore(app);
// export const storage = getStorage();