import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCoy0rvw3bRmBWwbH47X3eCsy7d0v52za4",
  authDomain: "login-app-ce17f.firebaseapp.com",
  projectId: "login-app-ce17f",
  storageBucket: "login-app-ce17f.firebasestorage.app",
  messagingSenderId: "908323273143",
  appId: "1:908323273143:web:558382c53aa85a6cc6d032",
  measurementId: "G-P3SSBVYJZ2"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
