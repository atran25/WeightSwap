// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyBTQkI3K3UL4znVD5znHdats1kso1dbuwE",

  authDomain: "weightswap-c7708.firebaseapp.com",

  projectId: "weightswap-c7708",

  storageBucket: "weightswap-c7708.appspot.com",

  messagingSenderId: "654650334562",

  appId: "1:654650334562:web:0887d50aabe0577931203b"

};


// Initialize Firebase

initializeApp(firebaseConfig);
export const db = getFirestore()