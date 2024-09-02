import { api } from './api';
import { authHeaders } from './authHeaders';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function updatePostTitleAndContent(
  authToken: string,
  id: number,
  title: string,
  content: string,
): Promise<Post> {
  const res = await api.patch(
    `/posts/${id}`,
    { title, content },
    authHeaders(authToken),
  );
  const post: Post = res.data;
  parsePostDates(post);
  return post;
}

export { updatePostTitleAndContent };
