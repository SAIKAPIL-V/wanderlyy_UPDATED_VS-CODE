// Load Firebase config from environment variables (production) or fallback to defaults (development)
// For production, set NEXT_PUBLIC_FIREBASE_* env vars in your deployment platform (Vercel, Render, etc.)
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAWcdUtLloUK-94E7zRdT_ro5DECHgAuts",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "studio-8197606483-51e56.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studio-8197606483-51e56",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "studio-8197606483-51e56.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "693773864041",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:693773864041:web:a049dcd8607e76706026f8",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "",
};
