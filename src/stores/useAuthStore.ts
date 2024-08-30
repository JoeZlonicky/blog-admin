import { getAuthToken } from '@/api/getAuthToken';
import axios, { AxiosError } from 'axios';
import { defineStore } from 'pinia';
import { ref } from 'vue';

const LOCAL_STORAGE_KEY = 'auth';

const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  const needsAuthentication = ref(true);

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

  async function logOut() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    token.value = '';
    needsAuthentication.value = true;
  }

  function checkLocalStorage() {
    const savedToken = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedToken) {
      token.value = savedToken;
      needsAuthentication.value = false;
    }
  }

  async function callWithAuthentication(
    f: () => Promise<void>,
    noAuthCb?: () => void,
  ) {
    if (!token.value) {
      noAuthCb?.();
      needsAuthentication.value = true;
      return;
    }
    try {
      await f();
    } catch (err) {
      noAuthCb?.();
      if (err instanceof AxiosError && err.status === 401) {
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
    logOut,
    checkLocalStorage,
    callWithAuthentication,
  };
});

export { useAuthStore };
