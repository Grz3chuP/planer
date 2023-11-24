// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, onValue, get, remove,push } from "firebase/database";
import {Job_interface} from "./interface/Job_interface";
import {jobListSignal} from "./store";


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

export async function saveData(data: Job_interface) {
  const newDocRef= push(ref(db, "planer1"));

  try {
    await set(newDocRef, data);
    const key = newDocRef.key;
    if (key) {
      await set(ref(db, "planer1/" + key + "/id"), key);
      alert("success");
      return key;
    } else {
      console.error('Failed to get the key from Firebase.');
      return null;
    }
  } catch (error: any) {
      console.log("error");
      return null;
    }
}
export async function readData() {
   const query = ref(db, "planer1");
  await get(query).then(snapshot => {
    if (snapshot.exists()) {
      Object.values(snapshot.val()).forEach((item: any) => {
        jobListSignal().push(item);
        console.log('itemy z bazy danych' + item);
      });
      console.log(snapshot.val());
    } else {
     alert("No data available");
    }
  });
}

export async function removeData(id: string) {
  await remove(ref(db, "planer1/" + id)).then(
    () => {
     alert("Remove succeeded.");
    }
  ).catch((error) => {
    alert("Remove failed: " + error.message);
  }
  );
}
onValue(ref(db, 'planer1'), (snapshot) => {
  const data = snapshot.val();
  if (data) {
    console.log(data);


  }
});


