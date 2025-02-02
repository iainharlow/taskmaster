// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "taskmaster-af94a.firebaseapp.com",
  projectId: "taskmaster-af94a",
  // etc...
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);