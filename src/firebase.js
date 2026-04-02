// Importar Firebase desde CDN (Importante para Vercel web)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Configuración 
const firebaseConfig = {
  apiKey: "AIzaSyD70xg86U-asGO23EpfQ2exAPIpxVcsuQU",
  authDomain: "pura-vida-quiz.firebaseapp.com",
  projectId: "pura-vida-quiz",
  storageBucket: "pura-vida-quiz.firebasestorage.app",
  messagingSenderId: "220502084912",
  appId: "1:220502084912:web:2df57ec581387fbcd94cf5"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore 
export const db = getFirestore(app);
