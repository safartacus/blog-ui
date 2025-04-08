export interface IComment {
    _id: string;
    content: string;
    blogId: string;
    author: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage: {
        url: string;
      };
    };
    likes: string[];
    replies: {
      _id: string;
      content: string;
      author: {
        _id: string;
        firstName: string;
        lastName: string;
        profileImage: {
          url: string;
      };
      };
      createdAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
  }
  export class Comment implements IComment {
    _id!: string;
    content!: string;
    blogId!: string;
    author!: {
      _id: string;
      firstName: string;
      lastName: string;
      profileImage: {
        url: string;
      };
    };
    likes!: string[];
    replies!: {
      _id: string;
      content: string;
      author: {
        _id: string;
        firstName: string;
        lastName: string;
        profileImage: {
          url: string;
        };
      };
      createdAt: Date;
    }[];
    createdAt!: Date;
    updatedAt!: Date;
  }
  