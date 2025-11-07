<template>
  <div class="chat-box">
    <div class="messages">
      <div v-for="m in messages" :key="m.id" class="message">
        <strong>{{ m.user }}</strong
        >: {{ m.text }}
      </div>
    </div>

    <div class="input-box">
      <input v-model="msg" @keyup.enter="sendMessage" placeholder="Type your message..." />
      <button @click="sendMessage">Send</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { db } from '@/firebase/config';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { auth } from '@/firebase/config';

interface Message {
  id: string;
  text: string;
  user: string;
  createdAt: string;
}

const msg = ref('');
const messages = ref<Message[]>([]);

const messagesRef = collection(db, 'messages');

defineOptions({
  name: 'ChatBox',
});

// Listen to Firestore updates
onMounted(() => {
  const q = query(messagesRef, orderBy('createdAt'));
  onSnapshot(q, (snapshot) => {
    messages.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as Message);
  });
});

const sendMessage = async () => {
  if (!msg.value.trim()) return;
  const user = auth.currentUser;
  if (!user) return alert('Please login first');

  await addDoc(messagesRef, {
    text: msg.value,
    user: user.email,
    createdAt: serverTimestamp(),
  });

  msg.value = '';
};
</script>

<style scoped>
.chat-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.messages {
  flex: 1;
  overflow-y: auto;
}
.input-box {
  display: flex;
  gap: 8px;
  padding: 10px;
}
</style>
