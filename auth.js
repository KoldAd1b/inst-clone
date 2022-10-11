import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
export const signInWithPassword = async (email, password) => {
  return await signInWithEmailAndPassword(auth, email, password);
};
export const createAccount = async (email, password) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async (uid) => {
  await updateDoc(doc(db, "users", uid), { isOnline: false });
  return await signOut(auth);
};
