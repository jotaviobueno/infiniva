import { ICategory } from 'src/modules/category/interfaces/icategory';
import { IProduct } from 'src/modules/product/interfaces/iproduct';
import { Product } from 'src/repositories/implementations/mongodb/schemas/product.schema';

export function toIProduct(
  product: Product,
  categories: ICategory[],
  averate_rating: number,
): IProduct {
  return {
    product_id: product.product_id,
    name: product.name,
    description: product.description,
    is_active: product.is_active,
    categories: categories,
    images_url: product.images_url,
    product_url: product.product_url,
    averate_rating,
    information: {
      weight: product.information.weight,
      stock: product.information.stock,
      value: product.information.value,
      discount: product.information.discount,
      sold_count: product.information.sold_count,
    },
    rate: {
      five: product.rate.five,
      four: product.rate.four,
      three: product.rate.three,
      two: product.rate.two,
      one: product.rate.one,
    },
    createdAt: product.createdAt,
  };
}
