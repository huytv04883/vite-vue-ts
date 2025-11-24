import { UserCredential } from 'firebase/auth';

export const STORAGE_KEY = {
  USER: 'lulu_chat_user',
  TOKEN: 'lulu_chat_token',
  SETTINGS: 'lulu_chat_settings',
};

export const setDataUser = (user: UserCredential) => {
  localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(user));
};

export const getDataUser = (): UserCredential | null => {
  const userData = localStorage.getItem(STORAGE_KEY.USER);
  return userData ? JSON.parse(userData) : null;
};

export const clearDataUser = () => {
  localStorage.removeItem(STORAGE_KEY.USER);
};

export const updateDataUser = (updatedUser: Partial<UserCredential>) => {
  const currentUser = getDataUser();
  if (currentUser) {
    const newUser = { ...currentUser, ...updatedUser };
    localStorage.setItem(STORAGE_KEY.USER, JSON.stringify(newUser));
  }
};
