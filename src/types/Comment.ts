type Comment = {
  id: number;
  firstName: string;
  lastInitial: string;
  content: string;

  createdAt: Date;
  updatedAt: Date;

  postId: number;
};

export type { Comment };
