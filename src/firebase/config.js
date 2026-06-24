import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC85dGCrZueaxqnu-WpMaUMFzeNtBDHIdE",
  authDomain: "www.ismora.shop",
  projectId: "ecommerce-website-e9b2b",
  storageBucket: "ecommerce-website-e9b2b.firebasestorage.app",
  messagingSenderId: "752161163712",
  appId: "1:752161163712:web:7861ce85725605f2922025"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);