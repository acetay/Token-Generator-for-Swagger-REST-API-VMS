// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "group1-vms-project.firebaseapp.com",
  projectId: "group1-vms-project",
  storageBucket: "group1-vms-project.appspot.com",
  messagingSenderId: "1087338640470",
  appId: process.env.REACT_APP_FIREBASE_API_ID,
  measurementId: "G-9Z1NHWHNW5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
