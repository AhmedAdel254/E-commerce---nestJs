/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from './product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const product = await this.ProductModel.findOne({
      title: createProductDto.title,
    });
    if (product) {
      throw new HttpException('Product with this title already exists', 400);
    }
    const priceAfterDiscount = createProductDto?.priceAfterDiscount || 0; // افتراضى لو مش موجود
    if (createProductDto.price < priceAfterDiscount) {
      throw new HttpException(
        'Price after discount must be less than price',
        400,
      );
    }
    const newProduct = await (
      await this.ProductModel.create(createProductDto)
    ).populate('category subCategory brand', '-__v -_id');
    return {
      status: 200,
      message: 'Product created successfully',
      data: newProduct,
    };
  }

  async findAll(query: any) {
    //1 - fillter
    let queryObj = { ...query };
    const excludedFields = ['page', 'limit', 'sort', 'fields', 'keyword'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    queryObj = JSON.parse(queryStr);

    //2 - paginate
    const page = query?.page * 1 || 1;
    const limit = query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    //3 - sorting
    let sort = query?.sort || 'asc';
    if (!['asc', 'desc'].includes(sort)) {
      throw new HttpException('Invalid sort', 400);
    }
    //4- field selection
    let fields = query?.fields || '';
    fields = fields.split(',').join(' ');

    //5- search
    let findData = { ...queryObj };
    if (query.keyword) {
      findData.$or = [
        { title: { $regex: query.keyword } },
        { description: { $regex: query.keyword } },
      ];
    }

    const products = await this.ProductModel.find(findData)
      .select(fields)
      .sort({ title: sort })
      .skip(skip)
      .limit(limit);
    return {
      status: 200,
      message: 'Products retrieved successfully',
      length: products.length,
      page: page,
      data: products,
    };
  }

  async findOne(id: string) {
    const product = await this.ProductModel.findById(id).populate(
      'category subCategory brand',
      '-__v -_id',
    );
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    return {
      status: 200,
      message: 'Product retrieved successfully',
      data: product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.ProductModel.findById(id).populate(
      'category subCategory brand',
      '-__v -_id',
    );
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    const priceAfterDiscount =
      updateProductDto?.priceAfterDiscount || product.priceAfterDiscount;
    const price = updateProductDto?.price || product.price;

    if (price < priceAfterDiscount) {
      throw new HttpException(
        'Price after discount must be less than price',
        400,
      );
    }
    const updatedProduct = await this.ProductModel.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'Product updated successfully',
      data: updatedProduct,
    };
  }

  async remove(id: string) {
    const product = await this.ProductModel.findById(id);
    if (!product) {
      throw new HttpException('Product not found', 404);
    }
    await this.ProductModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Product deleted successfully',
    };
  }
}
