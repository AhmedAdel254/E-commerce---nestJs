import { HttpException, Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Brand } from './brand.schema';
import { Model } from 'mongoose';

@Injectable()
export class BrandService {
  constructor(@InjectModel(Brand.name) private BrandModel: Model<Brand>) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = await this.BrandModel.findOne({ name: createBrandDto.name });
    if (brand) {
      throw new HttpException('Category with this name already exists', 400);
    }
    const newBrand = await this.BrandModel.create(createBrandDto);
    return {
      status: 200,
      message: 'Brand created successfully',
      data: newBrand,
    };
  }

  async findAll(query: { name: string }) {
    const { name } = query;
    const brands = await this.BrandModel.find()
      .where('name', new RegExp(name, 'i'))
      .select('-__v');
    return {
      status: 200,
      message: 'Brands retrieved successfully',
      length: brands.length,
      data: brands,
    };
  }

  async findOne(id: string) {
    const brand = await this.BrandModel.findById(id);
    if (!brand) {
      throw new HttpException('Brand not found', 404);
    }
    return {
      status: 200,
      message: 'Brand retrieved successfully',
      data: brand,
    };
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const existingBrand = await this.BrandModel.findById(id);
    if (!existingBrand) {
      throw new HttpException('Brand not found', 404);
    }
    const updatedBrand = await this.BrandModel.findByIdAndUpdate(
      id,
      updateBrandDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'Brand updated successfully',
      data: updatedBrand,
    };
  }

  async remove(id: string) {
    const existingBrand = await this.BrandModel.findById(id);
    if (!existingBrand) {
      throw new HttpException('Brand not found', 404);
    }
    await this.BrandModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Brand deleted successfully',
    };
  }
}
