export interface INotification {
    _id: string;
    recipient: string;
    sender: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: {
        url: string;
      };
    };
    type: 'BLOG_LIKE' | 'COMMENT_LIKE';
    blogId?: {
      _id: string;
      title: string;
    };
    commentId?: string;
    read: boolean;
    createdAt: Date;
  }
  export class Notification implements INotification {
    _id!: string;
    recipient!: string;
    sender!: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage?: {
        url: string;
      };
    };
    type!: 'BLOG_LIKE' | 'COMMENT_LIKE';
    blogId?: {
      _id: string;
      title: string;
    };
    commentId?: string;
    read!: boolean;
    createdAt!: Date;
  }