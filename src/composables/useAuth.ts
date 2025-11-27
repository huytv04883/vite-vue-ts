import { auth } from '@/firebase/config';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { ref } from 'vue';

const provider = new GoogleAuthProvider();
const user = ref(auth.currentUser);

auth.onAuthStateChanged((_user) => {
  user.value = _user;
});

export function useAuth() {
  const register = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = async () => {
    return await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return { user, register, login, logout, signInWithGoogle };
}
