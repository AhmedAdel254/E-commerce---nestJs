import { HttpException, Injectable } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { Coupon } from './coupon.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class CouponService {
  constructor(@InjectModel(Coupon.name) private CouponModel: Model<Coupon>) {}
  async create(createCouponDto: CreateCouponDto) {
    const exitCoupon = await this.CouponModel.findOne({
      name: createCouponDto.name,
    });
    if (exitCoupon) {
      throw new HttpException('Coupon with this name already exists', 400);
    }
    const newCoupon = await this.CouponModel.create(createCouponDto);
    return {
      status: 200,
      message: 'Coupon created successfully',
      data: newCoupon,
    };
  }

  async findAll() {
    const coupons = await this.CouponModel.find().select('-__v');
    return {
      status: 200,
      message: 'Coupons retrieved successfully',
      data: coupons,
    };
  }

  async findOne(id: string) {
    const existsCoupon = await this.CouponModel.findById(id).select('-__v');
    if (!existsCoupon) {
      throw new HttpException('Coupon not found', 404);
    }
    return {
      status: 200,
      message: 'Coupon retrieved successfully',
      data: existsCoupon,
    };
  }

  async update(id: string, updateCouponDto: UpdateCouponDto) {
    const existsCoupon = await this.CouponModel.findById(id).select('-__v');
    if (!existsCoupon) {
      throw new HttpException('Coupon not found', 404);
    }
    const updatedCoupon = await this.CouponModel.findByIdAndUpdate(
      id,
      updateCouponDto,
      { new: true },
    );
    return {
      status: 200,
      message: 'Coupon updated successfully',
      data: updatedCoupon,
    };
  }

  async remove(id: string) {
    const existsCoupon = await this.CouponModel.findById(id).select('-__v');
    if (!existsCoupon) {
      throw new HttpException('Coupon not found', 404);
    }
    await this.CouponModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Coupon deleted successfully',
    };
  }
}
