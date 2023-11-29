// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';


//  web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD5VOhb-g5XCNXY7X1o92U-9x0HXT3ovYg",
    authDomain: "malefashion-3dd63.firebaseapp.com",
    projectId: "malefashion-3dd63",
    storageBucket: "malefashion-3dd63.appspot.com",
    messagingSenderId: "1056354549614",
    appId: "1:1056354549614:web:21f350c76b4a7f3f43cb7f"
  };
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);


export { auth, db, storage};
// export default firebaseCo