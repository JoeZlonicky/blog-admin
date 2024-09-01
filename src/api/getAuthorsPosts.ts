import { api } from './api';
import { authHeaders } from './authHeaders';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function getAuthorsPosts(authToken: string, authorId: string) {
  const res = await api.get(
    `/posts?authorId=${authorId}`,
    authHeaders(authToken),
  );
  const posts: Post[] = res.data;
  posts.forEach((post) => {
    parsePostDates(post);
  });
  return posts;
}

export { getAuthorsPosts };
