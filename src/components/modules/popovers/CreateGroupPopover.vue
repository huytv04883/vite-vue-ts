<script setup lang="ts">
import { createGroupChat } from '@/services/groupChatService';
import { getRandomUsers } from '@/services/userService';
import { useAppStore } from '@/store/appStore';
import { User } from '@/types/user.type';
import { MESSAGES } from '@/utils/message';
import { Search } from '@element-plus/icons-vue';
import { getAuth } from 'firebase/auth';
import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const drawer = ref(false);
const groupName = ref('');
const searchQuery = ref('');
const allUsers = ref<User[]>([]);
const selectedUsers = ref<User[]>([]);
const isLoading = ref(false);

const appStore = useAppStore();
const router = useRouter();
const auth = getAuth();

watch(
  () => appStore.isOpenCreateGroupPopover,
  (newVal) => {
    drawer.value = newVal;
    // Reset form when opening
    if (newVal) {
      groupName.value = '';
      searchQuery.value = '';
      selectedUsers.value = [];
      loadUsers();
    }
  },
  { immediate: true },
);

watch(drawer, (newVal) => {
  if (!newVal && appStore.isOpenCreateGroupPopover) {
    appStore.setOpenCreateGroupPopover(false);
  }
});

const loadUsers = async () => {
  try {
    isLoading.value = true;
    allUsers.value = await getRandomUsers(100);
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to load users';
    MESSAGES.error(msg, 3);
  } finally {
    isLoading.value = false;
  }
};

const filteredUsers = computed(() => {
  if (!searchQuery.value.trim()) return allUsers.value;
  const query = searchQuery.value.toLowerCase();
  return allUsers.value.filter(
    (user) =>
      user.displayName?.toLowerCase().includes(query) || user.email?.toLowerCase().includes(query),
  );
});

const isUserSelected = (user: User) => {
  return selectedUsers.value.some((u) => u.uid === user.uid);
};

const toggleUserSelection = (user: User) => {
  const index = selectedUsers.value.findIndex((u) => u.uid === user.uid);
  if (index === -1) {
    selectedUsers.value.push(user);
  } else {
    selectedUsers.value.splice(index, 1);
  }
};

const handleCreateGroup = async () => {
  if (!groupName.value.trim()) {
    MESSAGES.warning('Please enter a group name', 3);
    return;
  }
  if (selectedUsers.value.length === 0) {
    MESSAGES.warning('Please select at least one member', 3);
    return;
  }

  const currentUser = auth.currentUser;
  if (!currentUser) {
    MESSAGES.error('You must be logged in to create a group', 3);
    return;
  }

  try {
    isLoading.value = true;
    const memberIds = selectedUsers.value.map((u) => u.uid);
    const groupId = await createGroupChat(
      groupName.value,
      [...memberIds, currentUser.uid],
      currentUser.uid,
    );

    MESSAGES.success('Group created successfully!', 3);
    drawer.value = false;
    router.push({ name: 'ChatGroup', params: { id: groupId } });
  } catch (error) {
    const msg = (error as { message?: string })?.message ?? 'Failed to create group';
    MESSAGES.error(msg, 3);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadUsers();
});
</script>

<template>
  <el-drawer
    class="create-group-drawer"
    v-model="drawer"
    title="Create Group"
    :with-header="true"
    direction="btt"
    size="80%"
  >
    <div class="create-group-content">
      <div class="group-name-section">
        <el-input
          v-model="groupName"
          placeholder="Enter group name"
          clearable
          size="large"
          class="group-name-input"
        />
      </div>

      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="Search members..."
          :prefix-icon="Search"
          clearable
          size="large"
        />
      </div>
      <div v-if="selectedUsers.length > 0" class="selected-members">
        <div class="selected-members__title">Selected ({{ selectedUsers.length }})</div>
        <div class="selected-members__list">
          <el-tag
            v-for="user in selectedUsers"
            :key="user.uid"
            closable
            @close="toggleUserSelection(user)"
            size="large"
          >
            <div class="selected-member-tag">
              <el-avatar :src="user.photoURL" :size="20" />
              <span>{{ user.displayName }}</span>
            </div>
          </el-tag>
        </div>
      </div>
      <div class="user-list-section">
        <div class="user-list-title">Select Members</div>
        <el-scrollbar v-loading="isLoading">
          <div class="user-list">
            <div
              v-for="user in filteredUsers"
              :key="user.uid"
              class="user-item"
              :class="{ 'user-item--selected': isUserSelected(user) }"
              @click="toggleUserSelection(user)"
            >
              <el-avatar :src="user.photoURL" :size="40" />
              <div class="user-info">
                <div class="user-name">{{ user.displayName }}</div>
                <div class="user-email">{{ user.email }}</div>
              </div>
              <el-checkbox :model-value="isUserSelected(user)" />
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="actions-section">
        <el-button @click="drawer = false" size="large">Cancel</el-button>
        <el-button
          type="primary"
          @click="handleCreateGroup"
          :loading="isLoading"
          :disabled="!groupName.trim() || selectedUsers.length === 0"
          size="large"
        >
          Create Group
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>
