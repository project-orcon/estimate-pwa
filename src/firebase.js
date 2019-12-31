import { initializeApp } from 'firebase';
const app = initializeApp({
    apiKey: "AIzaSyCXuzXsFlQp6ffLoIJcicvWVV4_ZV8c_4o",
    authDomain: "estimate-pwa.firebaseapp.com",
    databaseURL: "https://estimate-pwa.firebaseio.com",
    projectId: "estimate-pwa",
    storageBucket: "estimate-pwa.appspot.com",
    messagingSenderId: "129671000830",
    appId: "1:129671000830:web:857e03154f19f402452baf",
    measurementId: "G-RG49V21NP1"
  });

export const db = app.firestore();
export const estimatesCollection = db.collection('estimates');