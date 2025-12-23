import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAoM-5udZ1VY9Fqkv4bt1vp3Hsr3TbyyDk",
  authDomain: "quickshow-230e4.firebaseapp.com",
  projectId: "quickshow-230e4",
  storageBucket: "quickshow-230e4.firebasestorage.app",
  messagingSenderId: "1080001099261",
  appId: "1:1080001099261:web:76a37a3a17f1b4ef3d5594",
  measurementId: "G-SD63SWPF5L"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };