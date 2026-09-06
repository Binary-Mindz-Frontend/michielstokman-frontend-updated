import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyClt6tuVXciZ0597reW3PMbT0vnECTP9Bo',
  authDomain: 'transform-to-liberation-41aff.firebaseapp.com',
  projectId: 'transform-to-liberation-41aff',
  storageBucket: 'transform-to-liberation-41aff.firebasestorage.app',
  messagingSenderId: '670484106246',
  appId: '1:670484106246:web:65b1041542474753bf0787',
  measurementId: 'G-1VGYGCWMFB',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
