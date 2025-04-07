export interface ICategory {
    _id: string;
    name: string;
    slug: string;
    description?: string;
  }
export class Category implements ICategory {
    _id!: string;
    name!: string;
    slug!: string;
    description?: string;
  }