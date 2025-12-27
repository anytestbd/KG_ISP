import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
const firebaseConfig = {
  authDomain: "admin1310.firebaseapp.com",
  projectId: "admin1310",
  storageBucket: "admin1310.firebasestorage.app",
  messagingSenderId: "984168457052",
  appId: "1:984168457052:web:8f72b84fea77e81c525799"
};
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);