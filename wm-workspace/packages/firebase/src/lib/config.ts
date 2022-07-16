import { dbConfig } from '@wm-workspace/app-config';
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: dbConfig.apiKey,
  authDomain: dbConfig.authDomain,
  projectId: dbConfig.projectId,
  storageBucket: dbConfig.storageBucket,
  messagingSenderId: dbConfig.messagingSenderId,
  appId: dbConfig.appId,
  measurementId: dbConfig.measurementId,
};

// Initialize Firebase
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// export const analytics = getAnalytics(app);
export const database = getFirestore(app);
