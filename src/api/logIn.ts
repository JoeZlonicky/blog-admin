import { api } from './api';

async function logIn(username: string, password: string) {
  const response = await api.post('/auth', { username, password });
  const jwt = response.data;
  localStorage.setItem('jwt', jwt);
}

export { logIn };
