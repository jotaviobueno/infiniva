import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryRepository } from 'src/repositories/abstracts/category/category.repository';
import { Category, CategoryDocument } from '../schemas/category.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class MongodbCategoryRepository implements CategoryRepository {
  constructor(
    @InjectModel(Category.name)
    private readonly model: Model<CategoryDocument>,
  ) {}

  async create(userId: Types.ObjectId, name: string): Promise<Category> {
    const category = new this.model({ userId, name });

    return await category.save();
  }

  async findByName(name: string): Promise<Category> {
    return await this.model.findOne({ name });
  }
}
