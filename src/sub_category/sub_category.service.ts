/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Injectable } from '@nestjs/common';
import { createSubCategoryDto } from './dto/create-sub_category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';
import { SubCategory } from './subCategory.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from 'src/category/category.schema';

@Injectable()
export class SubCategoryService {
  constructor(
    @InjectModel(SubCategory.name) private SubCategoryModel: Model<SubCategory>,
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  async create(createSubCategoryDto: createSubCategoryDto) {
    const existingSubCategory = await this.SubCategoryModel.findOne({
      name: createSubCategoryDto.name,
    });
    if (existingSubCategory) {
      throw new HttpException('Category with this name already exists', 400);
    }
    //34an lm yd5l id l category y4oof hwa mwgood wla g2
    const category = await this.CategoryModel.findById(
      createSubCategoryDto.category,
    );
    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    const created = await this.SubCategoryModel.create({
      ...createSubCategoryDto,
    });
    const newSubCategory = await this.SubCategoryModel.findById(created._id)
      .populate('category', '-__v -_id')
      .select('-__v');
    return {
      status: 200,
      message: 'SubCategory created successfully',
      data: newSubCategory,
    };
  }

  async findAll(query: any) {
    const { name } = query;
    const subCategories = await this.SubCategoryModel.find()
      .populate('category', '-__v -_id')
      .where('name', new RegExp(name, 'i'));
    return {
      status: 200,
      message: 'SubCategories retrieved successfully',
      length: subCategories.length,
      data: subCategories,
    };
  }

  async findOne(id: string) {
    const subCategory = await this.SubCategoryModel.findById(id)
      .populate('category', '-__v -_id')
      .select('-__v');
    if (!subCategory) {
      throw new HttpException('SubCategory not found', 404);
    }
    return {
      status: 200,
      message: 'SubCategory retrieved successfully',
      data: subCategory,
    };
  }

  async update(id: string, updateSubCategoryDto: UpdateSubCategoryDto) {
    const existingSubCategory = await this.SubCategoryModel.findById(id);
    if (!existingSubCategory) {
      throw new HttpException('SubCategory not found', 404);
    }
    const updatedSubCategory = await this.SubCategoryModel.findByIdAndUpdate(
      id,
      updateSubCategoryDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'SubCategory updated successfully',
      data: updatedSubCategory,
    };
  }

  async remove(id: string) {
    const existingSubCategory = await this.SubCategoryModel.findById(id);
    if (!existingSubCategory) {
      throw new HttpException('SubCategory not found', 404);
    }
    const deletedSubCategory =
      await this.SubCategoryModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'SubCategory deleted successfully',
      data: deletedSubCategory,
    };
  }
}
