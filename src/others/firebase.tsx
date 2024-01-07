// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAzmEi4Hs0e0xCtlEIkM2CVsuGXCnXfIAg",
  authDomain: "meeting-organiser-81279.firebaseapp.com",
  projectId: "meeting-organiser-81279",
  storageBucket: "meeting-organiser-81279.appspot.com",
  messagingSenderId: "485696218553",
  appId: "1:485696218553:web:7e7729debea1bf667f0268",
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);
