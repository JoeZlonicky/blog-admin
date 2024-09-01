import { api } from './api';
import { authHeaders } from './authHeaders';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function createPost(authToken: string, authorId: number): Promise<Post> {
  const res = await api.post(`/posts`, { authorId }, authHeaders(authToken));
  const post: Post = res.data;
  parsePostDates(post);
  return post;
}

export { createPost };
