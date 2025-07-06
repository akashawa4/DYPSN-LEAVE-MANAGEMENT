// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAnYtVcATytnQQCuBOE_0rK3mfhNujvU24",
  authDomain: "dypsn-teachers-leave.firebaseapp.com",
  projectId: "dypsn-teachers-leave",
  storageBucket: "dypsn-teachers-leave.firebasestorage.app",
  messagingSenderId: "682691028081",
  appId: "1:682691028081:web:e1e869db5922a94749a7d0",
  databaseURL: "https://dypsn-teachers-leave-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const db = getFirestore(app);