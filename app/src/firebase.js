// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

// Your Firebase config object
const firebaseConfig = {
  apiKey: "AIzaSyDlZ40NbQC9h1t1mwEqh4PYE98HbRSsnoA",
  authDomain: "taskmaster-af94a.firebaseapp.com",
  projectId: "taskmaster-af94a",
  storageBucket: "taskmaster-af94a.firebasestorage.app",
  messagingSenderId: "898535024016",
  appId: "1:898535024016:web:2c7c573fdfa8ec5f62ff15",
  measurementId: "G-BZ4FW7G78T"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);

// Initialize App Check with your reCAPTCHA v3 Site Key
// Replace "YOUR_SITE_KEY_HERE" with your actual site key from the reCAPTCHA Admin Console.
// Initialize App Check with your reCAPTCHA v3 site key
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("6Lf2T9MqAAAAAAzPT8LPSomYNBQhw2c6-NxzhKaz"),
  isTokenAutoRefreshEnabled: true,
});