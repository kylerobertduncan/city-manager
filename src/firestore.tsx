// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: "AIzaSyCL0bHQdMvkv9o2P75TbL3cePcfS60DZUg",
	authDomain: "city-manager-12fb1.firebaseapp.com",
	projectId: "city-manager-12fb1",
	storageBucket: "city-manager-12fb1.appspot.com",
	messagingSenderId: "516213598345",
	appId: "1:516213598345:web:3d7b67dfd68f144f39be58",
	measurementId: "G-M0CQRJLSMG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);
