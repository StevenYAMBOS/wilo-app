import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  type User,
  getIdToken
} from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { writable } from "svelte/store";

// 🔹 Vérification si on est côté navigateur
const isBrowser = typeof window !== "undefined";

// 🔹 Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB6uK7uVN57yleJ0ZMx7HJCYT8_ctDgmTk",
  authDomain: "wilodb-a3cea.firebaseapp.com",
  projectId: "wilodb-a3cea",
  storageBucket: "wilodb-a3cea.firebasestorage.app",
  messagingSenderId: "940181073447",
  appId: "1:940181073447:web:86bff4ec07cbb9fd8d2802",
  measurementId: "G-8EZW66D3K2"
};

// 🔹 Initialisation Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/calendar");

// 🔹 Interface utilisateur
export interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  role: "superadmin" | "admin" | "user";
  status: "active" | "inactive" | "pending" | "suspended";
  Company: string | null;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}

// 🔹 Store utilisateur avec persistance locale
export const userStore = writable<UserData | null>(null);

// 🔹 Fonction pour enregistrer et récupérer l'utilisateur dans `localStorage`
function saveUserToLocalStorage(user: UserData | null) {
  if (!isBrowser) return; // Empêcher l'accès côté serveur
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  } else {
    localStorage.removeItem("user");
  }
}

function loadUserFromLocalStorage(): UserData | null {
  if (!isBrowser) return null; // Empêcher l'accès côté serveur
  const storedUser = localStorage.getItem("user");
  return storedUser ? JSON.parse(storedUser) : null;
}

// 🔹 Initialiser le store avec `localStorage`
if (isBrowser) {
  userStore.set(loadUserFromLocalStorage());
}

// 🔹 Vérification de l'état de connexion
onAuthStateChanged(auth, async (user: User | null) => {
  console.log("🔄 Détection de l'état de connexion Firebase :", user);

  if (user) {
    try {
      const userRef = doc(db, "user", user.uid);
      const userSnap = await getDoc(userRef);

      let userData: UserData = {
        id: user.uid,
        email: user.email || "",
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        profilePicture: user.photoURL || "",
        role: "user",
        status: "pending",
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        Company: null,
      };

      if (!userSnap.exists()) {
        await setDoc(userRef, userData);
      } else {
        const fetchedData = userSnap.data();
        userData = {
          ...userData,
          ...fetchedData,
          createdAt: fetchedData.createdAt?.toDate ? fetchedData.createdAt.toDate() : new Date(),
          updatedAt: fetchedData.updatedAt?.toDate ? fetchedData.updatedAt.toDate() : new Date(),
        };
        await updateDoc(userRef, { lastLogin: new Date() });
      }

      console.log("✅ Utilisateur restauré :", userData);

      userStore.set(userData);
      saveUserToLocalStorage(userData);
    } catch (error) {
      console.error("🔥 Erreur lors de la récupération de l'utilisateur :", error);
    }
  } else {
    console.log("❌ Aucun utilisateur détecté.");
    userStore.set(null);
    saveUserToLocalStorage(null);
  }
});


export async function getCurrentUser(): Promise<UserData | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        resolve(null);
        return;
      }

      const userRef = doc(db, "user", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        resolve(null);
        return;
      }

      const fetchedData = userSnap.data();
      resolve({
        id: user.uid,
        email: user.email || "",
        firstName: user.displayName?.split(" ")[0] || "",
        lastName: user.displayName?.split(" ")[1] || "",
        profilePicture: user.photoURL || "",
        role: fetchedData.role || "user",
        status: fetchedData.status || "pending",
        lastLogin: fetchedData.lastLogin?.toDate ? fetchedData.lastLogin.toDate() : new Date(),
        createdAt: fetchedData.createdAt?.toDate ? fetchedData.createdAt.toDate() : new Date(),
        updatedAt: fetchedData.updatedAt?.toDate ? fetchedData.updatedAt.toDate() : new Date(),
        Company: fetchedData.Company || null,
      });
    });

    return () => unsubscribe();
  });
}

// 🔹 Rafraîchir le token Google après un refresh
export async function refreshGoogleToken(): Promise<string | null> {
  if (!auth.currentUser) return null;

  try {
    const token = await getIdToken(auth.currentUser, true); // 🔹 Force un nouveau token
    if (isBrowser) {
      localStorage.setItem("google_access_token", token);
    }
    return token;
  } catch (error) {
    console.error("🔥 Erreur lors du rafraîchissement du token :", error);
    return null;
  }
}

// 🔹 Connexion avec Google
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const accessToken = credential?.accessToken;

    if (!result.user) return null;

    if (isBrowser) {
      localStorage.setItem("google_access_token", accessToken || ""); // 🔹 Stocker le token Google API
    }

    return { user: result.user, accessToken };
  } catch (error) {
    console.error("Erreur connexion Google :", error);
    return null;
  }
}

// 🔹 Déconnexion
export async function logout() {
  await signOut(auth);
  userStore.set(null);
  if (isBrowser) {
    localStorage.removeItem("user");
    localStorage.removeItem("google_access_token");
  }
}
