import { api } from './api';
import { parsePostDates } from './parsePostDates';
import type { Post } from '@/types/Post';

async function getPosts(): Promise<Post[]> {
  const jwt = localStorage.getItem('jwt');
  if (!jwt) {
    throw new Error();
  }

  const res = await api.get('/posts?published=all', {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  const posts: Post[] = res.data.results;
  posts.forEach((post) => {
    parsePostDates(post);
  });
  return posts;
}

export { getPosts };
