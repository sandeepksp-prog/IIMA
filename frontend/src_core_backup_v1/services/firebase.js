import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, doc, getDoc } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics"; 

// Configuration from User Credentials
// Project ID: iim2026
// API Key: Provided via 'Jules API' context
const firebaseConfig = {
    apiKey: "AQ.Ab8RN6JhDjjW24ah4a6-Mp9erZx3CqPs5WAJU5ZSGzevRp3GrA", // User provided key
    authDomain: "iim2026.firebaseapp.com",
    projectId: "iim2026",
    storageBucket: "iim2026.firebasestorage.app",
    messagingSenderId: "362689988948", // Project Number
    appId: "1:362689988948:web:placeholder" // We might need the exact App ID, but trying standard format
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const analytics = getAnalytics(app); 

export { db, collection, getDocs, doc, getDoc };
