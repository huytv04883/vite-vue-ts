import { db } from '@/firebase/config';
import { Group } from '@/types/group.type';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
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

export const sendMessage = async (groupId: string, senderId: string, text: string) => {
  await addDoc(collection(db, `groups/${groupId}/messages`), {
    senderId,
    text,
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
