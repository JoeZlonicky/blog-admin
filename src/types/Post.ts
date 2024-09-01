import type { Comment } from './Comment';

type Post = {
  id: number;
  title: string;
  content?: string;

  publishedAt: Date;
  createdAt: Date;

  comments: Comment[];

  authorId: number;
};

export type { Post };
