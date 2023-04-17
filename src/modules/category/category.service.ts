import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CategoryRepository } from 'src/repositories/abstracts/category/category.repository';
import { ICategory } from './interfaces/icategory';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async handleCrationCategory(userId: Types.ObjectId, names: string[]) {
    const categories = await Promise.all(
      names.map(async (name): Promise<ICategory> => {
        const nameAlreadyExist = await this.categoryRepository.findByName(name);

        if (nameAlreadyExist)
          return {
            _id: nameAlreadyExist._id,
            category_id: nameAlreadyExist.category_id,
            name: nameAlreadyExist.name,
          };

        const category = await this.categoryRepository.create(userId, name);

        return {
          _id: category._id,
          category_id: category.category_id,
          name: category.name,
        };
      }),
    );

    return categories;
  }

  onlyId(categories: ICategory[]): Types.ObjectId[] {
    const onlyId = categories.map((category) => {
      return category._id;
    });

    return onlyId;
  }
}
