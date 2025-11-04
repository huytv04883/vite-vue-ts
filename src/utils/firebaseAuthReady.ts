import { getAuth, onAuthStateChanged } from 'firebase/auth';

export function waitForAuthReady() {
  const auth = getAuth();
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}
