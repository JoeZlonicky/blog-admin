import { getAuthToken } from '@/api/getAuthToken';
import type { AuthorPayload } from '@/types/AuthorPayload';
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const LOCAL_STORAGE_KEY = 'auth';

const useAuthStore = defineStore('auth', () => {
  const token = ref('');
  const needsAuthentication = ref(true);

  const authorName = computed(() => {
    if (!token.value) {
      return '';
    }

    const decoded = jwtDecode<AuthorPayload>(token.value);
    if (decoded.firstName && decoded.lastName) {
      return `${decoded.firstName} ${decoded.lastName}`;
    }
    return '';
  });

  const authorId = computed(() => {
    if (!token.value) {
      return 0;
    }

    const decoded = jwtDecode<AuthorPayload>(token.value);
    if (decoded.id) {
      return decoded.id;
    }
    return 0;
  });

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
    f: (authToken: string) => Promise<void>,
  ) {
    if (!token.value) {
      needsAuthentication.value = true;
      return;
    }
    try {
      await f(token.value);
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        needsAuthentication.value = true;
      } else {
        throw err;
      }
    }
  }

  return {
    token,
    authorId,
    authorName,
    needsAuthentication,
    attemptLogIn,
    logOut,
    checkLocalStorage,
    callWithAuthentication,
  };
});

export { useAuthStore };
