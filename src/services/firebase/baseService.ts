import { LIMIT_MESSAGES } from '@/constants/common';
import { db } from '@/firebase/config';
import { Message } from '@/types/message.type';
import {
  collection,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  startAfter,
} from 'firebase/firestore';

export const CHAT_TYPE = {
  chats: 'chats',
  groups: 'groups',
} as const;

export type CHAT_TYPE = (typeof CHAT_TYPE)[keyof typeof CHAT_TYPE];

export const listenMessages = (
  idChat: string,
  callback: (msgs: Message[]) => void,
  chatType: CHAT_TYPE,
) => {
  const q = query(collection(db, chatType, idChat, 'messages'), orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const messagesResult = snapshot
      .docChanges()
      .filter((c) => c.type === 'added' || c.type === 'modified')
      .map((msg) => ({
        id: msg.doc.id,
        type: msg.type,
        ...msg.doc.data(),
      }));

    if (messagesResult.length > 0) {
      callback([...messagesResult] as Message[]);
    }
  });
};

export const getRecentMessages = async (chatId: string, chatType: CHAT_TYPE, pageSize?: number) => {
  const q = query(
    collection(db, chatType, chatId, 'messages'),
    orderBy('createdAt', 'desc'),
    limit(pageSize ?? LIMIT_MESSAGES),
  );

  const snapshot = await getDocs(q);
  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as Message[]; // Reverse to get oldest-to-newest order

  const firstDoc = snapshot.docs[snapshot.docs.length - 1]; // The oldest doc (for backward pagination)
  const lastDoc = snapshot.docs[0]; // The newest doc (for forward/real-time listening)
  return { messages, firstDoc, lastDoc };
};

export const getOlderMessages = async (
  chatId: string,
  lastDoc: unknown,
  chatType: CHAT_TYPE,
  pageSize?: number,
) => {
  const q = query(
    collection(db, chatType, chatId, 'messages'),
    orderBy('createdAt', 'desc'),
    startAfter(lastDoc),
    limit(pageSize ?? LIMIT_MESSAGES),
  );

  const snapshot = await getDocs(q);
  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse(); // Reverse to match ascending order

  const newLastDoc = snapshot.docs[snapshot.docs.length - 1];
  return { messages, lastDoc: newLastDoc };
};
