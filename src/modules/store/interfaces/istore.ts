export interface IStore {
  store_id: string;
  name: string;
  description: string;
  image_url: string;
  // products: IProducts[] | IProduct[] | IProduct | IProducts;
  store_url: string;
  createdAt: Date;
  updatedAt: Date;
}
