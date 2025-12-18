/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Injectable } from '@nestjs/common';
import { Category } from './category.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './DTO/category.dto';
import { UpdateUserDto } from './DTO/updateCtecory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}
  async createCategory(category: CreateCategoryDto) {
    const existingCategory = await this.CategoryModel.findOne({
      name: category.name,
    });
    if (existingCategory) {
      throw new HttpException('Category with this name already exists', 400);
    }
    const newCategory = await this.CategoryModel.create({ ...category });
    return {
      status: 200,
      message: 'Category created successfully',
      data: newCategory,
    };
  }
  async getAllCategories(query) {
    const { name } = query;
    const categories = await this.CategoryModel.find()
      .where('name', new RegExp(name, 'i'))
      .select('-__v');
    return {
      status: 200,
      message: 'Categories retrieved successfully',
      length: categories.length,
      data: categories,
    };
  }
  async getsingleCategories(id: string) {
    const category = await this.CategoryModel.findById(id).select('-__v');
    return {
      status: 200,
      message: 'Category retrieved successfully',
      data: category,
    };
  }
  async updateCategory(updatedCategory: UpdateUserDto, id: string) {
    const existingCategory = await this.CategoryModel.findOne({ _id: id });
    if (!existingCategory) {
      throw new HttpException('Category with this name already exists', 400);
    }
    const updatedCategoryData = await this.CategoryModel.findOneAndUpdate(
      { _id: id },
      updatedCategory,
      { new: true },
    ).select('-__v');
    return {
      status: 200,
      message: 'Category updated successfully',
      data: updatedCategoryData,
    };
  }
  async removeCategory(id: string) {
    const category = await this.CategoryModel.findById(id);
    if (!category) {
      throw new HttpException('Category not found', 404);
    }
    await this.CategoryModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Category deleted successfully',
    };
  }
}
