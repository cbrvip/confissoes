
import { initializeApp } from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; 

const firebaseConfig = {
    apiKey: "AIzaSyCUu1AjeCEryTJSx1x06hFUtAI9KItmmF0",
    authDomain: "cornosbr-a0e84.firebaseapp.com",
    projectId: "cornosbr-a0e84",
    storageBucket: "cornosbr-a0e84.appspot.com",
    messagingSenderId: "968152091952",
    appId: "1:968152091952:web:70b6713cf88d9217c08cf5",
    measurementId: "G-YRQZZES9VJ"
  };


const app = initializeApp(firebaseConfig);
const db= getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };