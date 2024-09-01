import type { Post } from '@/types/Post';

function parsePostDates(post: Post) {
  post.createdAt = new Date(post.createdAt);
  post.comments.forEach((comment) => {
    comment.createdAt = new Date(comment.createdAt);
  });
}

export { parsePostDates };
