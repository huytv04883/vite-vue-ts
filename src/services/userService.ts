import { auth, db } from '@/firebase/config';
import { User } from '@/types/user.type';
import { doc, setDoc, serverTimestamp, getDoc, getDocs, collection } from 'firebase/firestore';

export const saveUserIfNotExists = async () => {
  const user = auth.currentUser;
  if (!user) return;

  const userRef = doc(db, 'users', user.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    });
  }
};

export const getRandomUsers = async (limitCount = 10) => {
  const currentUser = auth.currentUser;
  const querySnapshot = await getDocs(collection(db, 'users'));
  const allUsers: User[] = [];

  querySnapshot.forEach((doc) => {
    if (doc.id !== currentUser?.uid) {
      allUsers.push(doc.data() as User);
    }
  });

  const shuffled = allUsers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limitCount);
};
