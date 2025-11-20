import { LIMIT_MESSAGES } from '@/constants/common';
import { db } from '@/firebase/config';
import { Group } from '@/types/group.type';
import { Message } from '@/types/message.type';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  startAfter,
  updateDoc,
} from 'firebase/firestore';

export const createGroupChat = async (name: string, members: string[], createdBy: string) => {
  const chatDoc = await addDoc(collection(db, 'groups'), {
    name,
    members,
    createdBy,
    createdAt: serverTimestamp(),
  });

  return chatDoc.id;
};

export const getDataGroupChat = async (groupId: string) => {
  const groupRef = doc(db, 'groups', groupId);
  const snap = await getDoc(groupRef);
  if (!snap.exists()) return null;
  return {
    id: snap.id,
    ...snap.data(),
  };
};

export const addMemberToGroupChat = async (groupId: string, userIds: string[]) => {
  const groupRef = doc(db, 'groups', groupId);
  const snap = await getDoc(groupRef);
  if (!snap.exists()) return;
  if (userIds.some((userId) => snap.data().members.includes(userId))) return;
  await updateDoc(groupRef, {
    members: [...snap.data().members, ...userIds],
  });
};

export const sendMessage = async (
  groupId: string,
  senderId: string,
  text: string,
  avatarUrl: string,
) => {
  await addDoc(collection(db, `groups/${groupId}/messages`), {
    senderId,
    text,
    avatarUrl,
    createdAt: serverTimestamp(),
  });
};

export const getGroupsChatByUserId = async (userId: string) => {
  const groupsQuery = collection(db, 'groups');
  const groups: Group[] = [];
  const querySnapshot = await getDocs(groupsQuery);
  querySnapshot.forEach((doc) => {
    if (userId && doc.data().members.includes(userId)) {
      groups.push({ id: doc.id, ...doc.data() } as Group);
    }
  });
  return groups;
};

export const getRecentMessages = async (chatId: string, pageSize = LIMIT_MESSAGES) => {
  const q = query(
    collection(db, 'groups', chatId, 'messages'),
    orderBy('createdAt', 'desc'),
    limit(pageSize),
  );

  const snapshot = await getDocs(q);
  const messages = snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as Message[];

  const firstDoc = snapshot.docs[snapshot.docs.length - 1];
  const lastDoc = snapshot.docs[0];
  return { messages, firstDoc, lastDoc };
};

export const listenMessages = (chatId: string, callback: (msgs: Message[]) => void) => {
  const q = query(collection(db, 'groups', chatId, 'messages'), orderBy('createdAt', 'asc'));

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

export const getOlderMessages = async (
  chatId: string,
  lastDoc: unknown,
  pageSize = LIMIT_MESSAGES,
) => {
  const q = query(
    collection(db, 'groups', chatId, 'messages'),
    orderBy('createdAt', 'desc'),
    startAfter(lastDoc),
    limit(pageSize),
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
