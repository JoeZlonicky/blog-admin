import { api } from './api';
import { authHeaders } from './authHeaders';

async function deletePost(authToken: string, postId: number) {
  await api.delete(`/posts/${postId}`, authHeaders(authToken));
}

export { deletePost };
