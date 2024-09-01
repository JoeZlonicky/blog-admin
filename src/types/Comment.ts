type Comment = {
  id: number;
  firstName: string;
  lastInitial: string;
  content: string;

  approvedAt: Date;
  createdAt: Date;

  postId: number;
};

export type { Comment };
