import { api } from './api';
import { authHeaders } from './authHeaders';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function getPosts(authToken: string) {
  const res = await api.get('/posts', authHeaders(authToken));
  const posts: Post[] = res.data;
  posts.forEach((post) => {
    parsePostDates(post);
  });
  return posts;
}

export { getPosts };
