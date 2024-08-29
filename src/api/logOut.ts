import { api } from './api';

async function logOut() {
  await api.delete('/auth');
}

export { logOut };
