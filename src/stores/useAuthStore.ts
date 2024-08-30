import { getAuthToken } from '@/api/getAuthToken';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const LOCAL_STORAGE_KEY = 'auth';

const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  const needsAuthentication = ref(false);

  async function attemptLogIn(username: string, password: string) {
    try {
      token.value = await getAuthToken(username, password);
      localStorage.setItem(LOCAL_STORAGE_KEY, token.value);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const descriptiveErrorMessage = err.response?.data?.errors[0];
        throw new Error(descriptiveErrorMessage);
      } else {
        throw new Error('Log-in failed');
      }
    }
  }

  async function checkLocalStorage() {
    const savedToken = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedToken) {
      token.value = savedToken;
    }
  }

  async function callWithAuthentication(f: () => void) {
    if (!token.value) {
      console.log('No token yet...');
      needsAuthentication.value = true;
      return;
    }
    try {
      f();
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        console.log('Needs a new token...');
        needsAuthentication.value = true;
      } else {
        throw err;
      }
    }
  }

  return {
    token,
    needsAuthentication,
    attemptLogIn,
    checkLocalStorage,
    callWithAuthentication,
  };
});

export { useAuthStore };
