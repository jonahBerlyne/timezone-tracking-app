import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyApCdUd1vji0gGwdLVZU0pmyLRxHJGZ_Ok",
  authDomain: "timezone-tracking-app.firebaseapp.com",
  projectId: "timezone-tracking-app",
  storageBucket: "timezone-tracking-app.appspot.com",
  messagingSenderId: "825779299521",
  appId: "1:825779299521:web:33b1768ee5bf7ba6952040"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage();

const fireDB = getFirestore(app);

export default fireDB;