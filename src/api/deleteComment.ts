import { api } from './api';
import { authHeaders } from './authHeaders';

async function deleteComment(authToken: string, commentId: number) {
  await api.delete(`/comments/${commentId}`, authHeaders(authToken));
}

export { deleteComment };
