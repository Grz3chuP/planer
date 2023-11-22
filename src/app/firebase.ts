// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, onValue, get, remove } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG-DMPKzABTpAYJZ_pAD61x8p2EeHhkpc",
  authDomain: "planer-449d2.firebaseapp.com",
  projectId: "planer-449d2",
  storageBucket: "planer-449d2.appspot.com",
  messagingSenderId: "185548653059",
  appId: "1:185548653059:web:0f7350597e34a9e1f0c436"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const docRef = ref(db, "planer1");

export function saveData(data: any) {
  set(docRef, data).then(
    () => {
      console.log("success");
    },
    error => {
      console.log("error");
    }
  );
}

