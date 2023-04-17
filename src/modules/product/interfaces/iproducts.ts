import { ICategory } from 'src/modules/category/interfaces/icategory';

export interface IProducts {
  product_id: string;
  name: string;
  is_active: boolean;
  categories: ICategory[];
  information: {
    weight: number;
    stock: number;
    value: number;
    discount: number;
    sold_count: number;
  };
  images_url: string[];
  product_url: string;
  createdAt: Date;
}
