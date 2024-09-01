import { api } from './api';
import { authHeaders } from './authHeaders';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function updatePostPublished(
  authToken: string,
  id: number,
  isPublished: boolean,
): Promise<Post> {
  const res = await api.patch(
    `/posts/${id}`,
    { setPublished: isPublished },
    authHeaders(authToken),
  );
  const post: Post = res.data;
  parsePostDates(post);
  return post;
}

export { updatePostPublished };
