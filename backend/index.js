// Firebase configuration and initialization
const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAAA4hh5kVm6hssU6wkW_M9fvRMvDhyTtg",
  authDomain: "ui-design-studyroom.firebaseapp.com",
  projectId: "ui-design-studyroom",
  storageBucket: "ui-design-studyroom.firebasestorage.app",
  messagingSenderId: "298214357316",
  appId: "1:298214357316:web:b2327accf3b093ee1fff11",
  measurementId: "G-NXJ8MD4E4Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export for use in other files
module.exports = { db };
