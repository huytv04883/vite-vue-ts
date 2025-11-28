import { db } from '@/firebase/config';
import { deleteField, doc, getDoc, updateDoc } from 'firebase/firestore';

export const toggleReaction = async (
  chatId: string,
  messageId: string,
  userId: string,
  emoji: string,
) => {
  const msgRef = doc(db, 'chats', chatId, 'messages', messageId);
  const messageSnap = await getDoc(msgRef);
  if (!messageSnap.exists()) return;

  const currentReactions = messageSnap.data().reactions || {};
  const userReactions = currentReactions[userId] || [];

  let newReactions;
  if (userReactions.includes(emoji)) {
    newReactions = userReactions.filter((e: unknown) => e !== emoji);
  } else {
    newReactions = [...userReactions, emoji];
  }

  await updateDoc(msgRef, {
    [`reactions.${userId}`]: newReactions.length ? newReactions : deleteField(),
  });
};
