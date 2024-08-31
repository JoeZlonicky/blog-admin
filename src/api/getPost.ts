import { api } from './api';
import { authHeaders } from './authHeaders';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function getPost(authToken: string, id: number): Promise<Post> {
  const res = await api.get(`/posts/${id}`, authHeaders(authToken));
  const post: Post = res.data;
  parsePostDates(post);
  return post;
}

export { getPost };
