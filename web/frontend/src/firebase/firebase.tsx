// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCBzrYxypetKNX_GiRqCnkkqQtJw_LOI44",
  authDomain: "online-video-downloader-410712.firebaseapp.com",
  projectId: "online-video-downloader-410712",
  storageBucket: "online-video-downloader-410712.appspot.com",
  messagingSenderId: "740850080967",
  appId: "1:740850080967:web:1ab295475f8e8f2dc932e2",
  measurementId: "G-23BD333K8X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export default db;