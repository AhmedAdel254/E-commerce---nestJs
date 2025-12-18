/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { HttpException, Injectable } from '@nestjs/common';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { RequestProducts } from './request-product.schema';
import { Model } from 'mongoose';
import { User } from 'src/user/user.schema';

@Injectable()
export class RequestProductService {
  constructor(
    @InjectModel(RequestProducts.name)
    private requestProductModel: Model<RequestProducts>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}
  async create(createRequestProductDto: any) {
    const requestProduct = await this.requestProductModel.findOne({
      titleNeed: createRequestProductDto.titleNeed,
      user: createRequestProductDto.user,
    });

    if (requestProduct) {
      throw new HttpException('requestProduct already exist', 400);
    }
    const newRequestProduct = await (
      await this.requestProductModel.create(createRequestProductDto)
    ).populate('user', '-__v -_id-password');
    return {
      status: 200,
      message: 'requestProduct created successfully',
      data: newRequestProduct,
    };
  }

  async findAll() {
    const requestProducts = await this.requestProductModel
      .find()
      .select('-__v');
    return {
      status: 200,
      message: 'requestProducts retrieved successfully',
      data: requestProducts,
    };
  }

  async findOne(id: string, req: any) {
    const requestProduct = await this.requestProductModel
      .findById(id)
      .select('-__v')
      .populate('user', '-__v -role -password');
    if (!requestProduct) {
      throw new HttpException('requestProduct not found', 404);
    }
    if (
      req.user._id.toString() !== requestProduct.user._id.toString() &&
      req.user.role.toLowerCase() !== 'admin'
    ) {
      throw new HttpException('requestProduct not found', 404);
    }
    return {
      status: 200,
      message: 'requestProduct retrieved successfully',
      data: requestProduct,
    };
  }

  async update(id: string, updateRequestProductDto: UpdateRequestProductDto) {
    const requestProductExists = await this.requestProductModel
      .findById(id)
      .select('-__v')
      .populate('user', '-__v -role -password');
    if (!requestProductExists) {
      throw new HttpException('requestProduct not found', 404);
    }
    if (
      updateRequestProductDto.user?.toString() !==
      requestProductExists.user._id.toString()
    ) {
      throw new HttpException('requestProduct not found', 404);
    }
    const requestProduct = await this.requestProductModel
      .findByIdAndUpdate(id, updateRequestProductDto, { new: true })
      .select('-__v');
    return {
      status: 200,
      message: 'requestProduct updated successfully',
      data: requestProduct,
    };
  }

  async remove(id: string, user_id: string) {
    const requestProductExists = await this.requestProductModel
      .findById(id)
      .select('-__v')
      .populate('user', '-__v -role -password');
    if (!requestProductExists) {
      throw new HttpException('requestProduct not found', 404);
    }
    if (user_id.toString() !== requestProductExists.user._id.toString()) {
      throw new HttpException('requestProduct not found', 404);
    }
    this.requestProductModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'requestProduct deleted successfully',
    };
  }
}
