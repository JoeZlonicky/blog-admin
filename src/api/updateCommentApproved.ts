import { api } from './api';
import { authHeaders } from './authHeaders';
import type { Comment } from '@/types/Comment';

async function updateCommentApproved(
  authToken: string,
  commentId: number,
  isApproved: boolean,
) {
  const res = await api.patch(
    `/comments/${commentId}`,
    { setApproved: isApproved },
    authHeaders(authToken),
  );

  const comment: Comment = res.data;
  comment.createdAt = new Date(comment.createdAt);
  return comment;
}

export { updateCommentApproved };
