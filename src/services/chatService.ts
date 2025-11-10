import { LIMIT_MESSAGES } from '@/constants/common';
import { db } from '@/firebase/config';
import { Message } from '@/types/message.type';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
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

export const listenMessages = (
  chatId: string,
  lastDoc: unknown,
  callback: (msgs: Message[]) => void,
) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc'),
    ...(lastDoc ? [startAfter(lastDoc)] : []), // if first load, not listen from lastDoc
  );

  return onSnapshot(q, (snapshot) => {
    const added = snapshot.docChanges().filter((c) => c.type === 'added');
    if (added.length) {
      const newMsgs = added.map((c) => ({ id: c.doc.id, ...c.doc.data() }));
      callback(newMsgs as Message[]);
    }
  });
};

export const setTypingStatus = async (chatId: string, userId: string, isTyping: boolean) => {
  const typingRef = doc(db, 'chats', chatId);
  await setDoc(typingRef, { typing: { [userId]: isTyping } }, { merge: true });
};

export const listenTypingStatus = (
  chatId: string,
  otherUserId: string,
  callback: (isTyping: boolean) => void,
) => {
  const chatRef = doc(db, 'chats', chatId);

  return onSnapshot(chatRef, (snap) => {
    const data = snap.data();
    if (data?.typing && data.typing[otherUserId] !== undefined) {
      callback(data.typing[otherUserId]);
    }
  });
};

export const getRecentMessages = async (chatId: string, pageSize = LIMIT_MESSAGES) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'asc'),
    limit(pageSize),
  );

  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Message[];

  const lastDoc = snapshot.docs[snapshot.docs.length - 1];
  return { messages, lastDoc };
};

export const getOlderMessages = async (
  chatId: string,
  lastDoc: unknown,
  pageSize = LIMIT_MESSAGES,
) => {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('createdAt', 'desc'),
    startAfter(lastDoc),
    limit(pageSize),
  );

  const snapshot = await getDocs(q);
  const messages = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
  return { messages, lastDoc: newLastDoc };
};
