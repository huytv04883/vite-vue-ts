import { db } from '@/firebase/config';
import { Message } from '@/types/message.type';
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
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

// listen to messages in real-time
export const listenMessages = (chatId: string, callback: (msgs: Message[]) => void) => {
  const q = query(collection(db, `chats/${chatId}/messages`), orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Message[];
    callback(msgs);
  });
};
