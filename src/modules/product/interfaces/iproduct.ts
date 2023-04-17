import { ICategory } from 'src/modules/category/interfaces/icategory';
import { IRate } from './irate';

export interface IProduct {
  product_id: string;
  name: string;
  description: string;
  is_active: boolean;
  categories: ICategory[];
  images_url: string[];
  product_url: string;
  averate_rating: number;
  information: {
    weight: number;
    stock: number;
    value: number;
    discount: number;
    sold_count: number;
  };
  rate: IRate;
  createdAt: Date;
}
