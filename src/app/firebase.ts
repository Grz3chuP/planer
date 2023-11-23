// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, onValue, get, remove,push } from "firebase/database";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBG-DMPKzABTpAYJZ_pAD61x8p2EeHhkpc",
  authDomain: "planer-449d2.firebaseapp.com",
  projectId: "planer-449d2",
  databaseURL: 'https://planer-449d2-default-rtdb.europe-west1.firebasedatabase.app',
  storageBucket: "planer-449d2.appspot.com",
  messagingSenderId: "185548653059",
  appId: "1:185548653059:web:0f7350597e34a9e1f0c436"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

const docRef = ref(db, "planer1");

export async function saveData(data: any) {
  const newDocRef =push(ref(db, "planer1"));
   await set(newDocRef, data).then(
    () => {
      console.log("success");
    },
    (error: any) => {
      console.log("error");
    }
  );
}
export async function readData() {
   const query = ref(db, "planer1");
  await get(query).then(snapshot => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  });
}

onValue(ref(db, 'planer1'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    console.log(data);


  }
});


