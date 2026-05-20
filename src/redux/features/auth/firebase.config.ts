// src/config/firebase.config.ts
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDtyzNoySKvKI6VyIjHT8__Acb19iMNyEE',
  authDomain: 'shejan-a82dd.firebaseapp.com',
  projectId: 'shejan-a82dd',
};

// Next.js SSR (Server-Side Rendering) এর কারণে অ্যাপটি যেন বারবার ইনিশিয়েলাইজ না হয়
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
