import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';

// Import the Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAmspwnFJem1DzyIujzaphhHxDJ68S4qs4",
  authDomain: "eniessegrow.firebaseapp.com",
  projectId: "eniessegrow",
  storageBucket: "eniessegrow.firebasestorage.app",
  messagingSenderId: "540448772356",
  appId: "1:540448772356:web:2fc4b5e352e1a5ab5e0051",
  measurementId: "G-73SWE3NWL9"
};

// Initialize Firebase SDK
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
    // Skip logging for other errors, as this is simply a connection test.
  }
}
testConnection();
