import type { Author } from './Author';
import type { Comment } from './Comment';

type Post = {
  id: number;
  title: string;
  content?: string;

  published: boolean;
  createdAt: Date;
  updatedAt: Date;

  comments: Comment[];

  authorId: number;
  author: Author;
};

export type { Post };
