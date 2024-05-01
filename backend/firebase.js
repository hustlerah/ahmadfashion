// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


//  web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAuIhdP5E3RyJMWGZt83XtSwMtP0R74KNs",
  authDomain: "ahmad-cf9c2.firebaseapp.com",
  projectId: "ahmad-cf9c2",
  storageBucket: "ahmad-cf9c2.appspot.com",
  messagingSenderId: "805042322830",
  appId: "1:805042322830:web:f6616748c6a2381c23b8df"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { auth, db, storage};
// export default firebaseCo
