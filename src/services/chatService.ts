import { db } from '@/firebase/config';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where
} from 'firebase/firestore';

export const getOrCreateChat = async (userId1: string, userId2: string) => {
  const chatQuery = query(
    collection(db, 'chats'),
    where('users', 'in', [
      [userId1, userId2],
      [userId2, userId1],
    ]),
  );

  const snapshot = await getDocs(chatQuery);

  if (!snapshot.empty) {
    return snapshot.docs[0].id;
  }

  const chatDoc = await addDoc(collection(db, 'chats'), {
    users: [userId1, userId2],
    createdAt: serverTimestamp(),
  });

  return chatDoc.id;
};

export const sendMessage = async (chatId: string, senderId: string, text: string) => {
  await addDoc(collection(db, `chats/${chatId}/messages`), {
    senderId,
    text,
    createdAt: serverTimestamp(),
  });
};

export const setTypingStatus = async (chatId: string, userId: string, isTyping: boolean) => {
  const typingRef = doc(db, 'chats', chatId);
  await setDoc(typingRef, { typing: { [userId]: isTyping } }, { merge: true });
};

export const listenTypingStatus = (
  chatId: string,
  targetUserId: string,
  callback: (isTyping: boolean) => void,
) => {
  const chatRef = doc(db, 'chats', chatId);

  return onSnapshot(chatRef, (snap) => {
    const data = snap.data();
    if (data?.typing && data.typing[targetUserId] !== undefined) {
      callback(data.typing[targetUserId]);
    }
  });
};
