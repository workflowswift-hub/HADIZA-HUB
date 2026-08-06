// Import Firebase (SDK modulaire v10 via CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCPLbf3yGg06GcJTW3HRE5GQ6neS86MYOc",
  authDomain: "hadiza-hub.firebaseapp.com",
  projectId: "hadiza-hub",
  storageBucket: "hadiza-hub.firebasestorage.app",
  messagingSenderId: "1045598366102",
  appId: "1:1045598366102:web:785d831477b2af9a70d5b7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Numéro WhatsApp de la boutique (format international, sans + ni espaces)
export const WHATSAPP_NUMERO = "2250595453308";

// ⚠️ Config Cloudinary — nécessaire pour l'upload de photos depuis l'admin
// 1. Va sur cloudinary.com → ton Dashboard → note ton "Cloud name"
// 2. Settings → Upload → "Add upload preset" → Signing Mode: "Unsigned" → note le nom du preset
export const CLOUDINARY_CLOUD_NAME = "dma4ja0z";
export const CLOUDINARY_UPLOAD_PRESET = "Hadiza hub";
