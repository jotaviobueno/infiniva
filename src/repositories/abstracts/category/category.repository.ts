import { Types } from 'mongoose';
import { Category } from 'src/repositories/implementations/mongodb/schemas/category.schema';

export abstract class CategoryRepository {
  abstract create(userId: Types.ObjectId, name: string): Promise<Category>;

  abstract findByName(name: string): Promise<Category>;
}
