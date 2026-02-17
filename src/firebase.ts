import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDjHkbfYAsg-nSeoOtd01QbpphO3L6SOOw",
    authDomain: "bookaura-full-stack-project.firebaseapp.com",
    projectId: "bookaura-full-stack-project",
    storageBucket: "bookaura-full-stack-project.firebasestorage.app",
    messagingSenderId: "503925747840",
    appId: "1:503925747840:web:6c34269b992aee8a497665",
    measurementId: "G-WDR8NCY8M3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export { signInWithPopup };
