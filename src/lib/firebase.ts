import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
 apiKey: "AIzaSyDZy64P-GPs86jrrKs3ka-wn25LEZ1Iplc",
  authDomain: "sems-e875a.firebaseapp.com",
  projectId: "sems-e875a",
  storageBucket: "sems-e875a.firebasestorage.app",
  messagingSenderId: "573564947435",
  appId: "1:573564947435:web:0b71d6cbfd4e95390267ae"
}

// Validate Firebase config
const requiredKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId"]
const missingKeys = requiredKeys.filter(
  (key) =>
    !firebaseConfig[key as keyof typeof firebaseConfig] ||
    firebaseConfig[key as keyof typeof firebaseConfig] === `your-${key.toLowerCase().replace(/([A-Z])/g, "-$1")}-here`,
)

if (missingKeys.length > 0) {
  console.error("Missing Firebase configuration keys:", missingKeys)
  console.error("Please update src/lib/firebase.ts with your actual Firebase configuration")
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
