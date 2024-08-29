import type { Post } from '@/types/Post';

function parsePostDates(post: Post) {
  post.createdAt = new Date(post.createdAt);
  post.updatedAt = new Date(post.updatedAt);
  post.comments.forEach((comment) => {
    comment.createdAt = new Date(comment.createdAt);
    comment.updatedAt = new Date(comment.updatedAt);
  });
}

export { parsePostDates };
