import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAxSuC_Nwk0-x1poZ9gNb081FRS0FuVEcg",
  authDomain: "pastelada-apolonio-ce1f1.firebaseapp.com",
  projectId: "pastelada-apolonio-ce1f1",
  storageBucket: "pastelada-apolonio-ce1f1.firebasestorage.app",
  messagingSenderId: "346383309790",
  appId: "1:346383309790:web:91fecd144b9d37c94f5b4f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);