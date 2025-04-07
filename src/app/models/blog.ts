import { Category } from "./category";
import { User } from "./user";

export interface IBlog {
    _id: string;
    title: string;
    excerpt: string;
    content: string;
    imageUrl: string;
    date: Date;
    readTime: number;
    author: User;
    category: Category;
    createdAt: Date;
    updatedAt: Date;
  }
  export class Blog implements IBlog{
    _id!: string;
    title!: string;
    excerpt!: string;
    content!: string;
    imageUrl!: string;
    date!: Date;
    readTime!: number;
    author!: User;
    category!: Category;
    createdAt!: Date;
    updatedAt!: Date;
  }
  export interface ICreateBlogDto {
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    readTime: number;
    image?: File;
  }
  export class CreateBlogDto implements ICreateBlogDto{
    title!: string;
    excerpt!: string;
    content!: string;
    category!: string;
    author!: string;
    readTime!: number;
    image?: File;
  }