import { Injectable } from '@nestjs/common';
import { CreateTexDto } from './dto/create-Tax.dto';
import { Tax } from './Tax.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class TexService {
  constructor(@InjectModel(Tax.name) private TexModel: Model<Tax>) {}
  async createOrUpdate(createTexDto: CreateTexDto) {
    const Tax = await this.TexModel.findOne({});
    if (!Tax) {
      // create
      const newTex = await this.TexModel.create(createTexDto);
      return {
        status: 200,
        message: 'Tax created successfully',
        data: newTex,
      };
    } else {
      // update
      const updatedTex = await this.TexModel.findOneAndUpdate(
        {},
        createTexDto,
        {
          new: true,
        },
      ).select('-__v');
      return {
        status: 200,
        message: 'Tax updated successfully',
        data: updatedTex,
      };
    }
  }

  async find() {
    const Tax = await this.TexModel.findOne({}).select('-__v');
    return {
      status: 200,
      message: 'Tax retrieved successfully',
      data: Tax,
    };
  }
  async reSet(): Promise<void> {
    await this.TexModel.findOneAndUpdate({}, { taxPrice: 0, shippingPrice: 0 });
  }
}
