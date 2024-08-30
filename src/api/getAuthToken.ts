import { api } from './api';

async function getAuthToken(
  username: string,
  password: string,
): Promise<string> {
  const response = await api.post('/auth', { username, password });
  const token = response.data;
  return token;
}

export { getAuthToken };
