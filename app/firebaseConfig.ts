import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import "firebase/compat/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyCkskJFpmUNbop-0HB4ixoN5ENu98Utei4",
  authDomain: "weddings-app-1a13a.firebaseapp.com",
  projectId: "weddings-app-1a13a",
  storageBucket: "weddings-app-1a13a.firebasestorage.app",
  messagingSenderId: "991177390318",
  appId: "1:991177390318:web:033cd5b9619edfc7441bff",
  measurementId: "G-YZ5108NPN3"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const storage = firebase.storage();
export const db = firebase.firestore(); 
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;


export async function saveImageReference(url: string) {
  try {
    const docRef = await db.collection("images").add({
      path: url,
      createdAt: serverTimestamp,
    });
    console.log("Referință salvată cu ID:", docRef.id);
  } catch (error) {
    console.error("Eroare salvare Firestore:", error);
  }
}

