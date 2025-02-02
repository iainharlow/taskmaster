// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlZ40NbQC9h1t1mwEqh4PYE98HbRSsnoA",
  authDomain: "taskmaster-af94a.firebaseapp.com",
  projectId: "taskmaster-af94a",
  storageBucket: "taskmaster-af94a.firebasestorage.app",
  messagingSenderId: "898535024016",
  appId: "1:898535024016:web:2c7c573fdfa8ec5f62ff15",
  measurementId: "G-BZ4FW7G78T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firestore and export it as a named export "db"
export const db = getFirestore(app);