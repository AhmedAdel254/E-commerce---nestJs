import { HttpException, Injectable } from '@nestjs/common';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Suppliers } from './suppliers.schema';
import { Model } from 'mongoose';

@Injectable()
export class SuppliersService {
  [x: string]: any;
  constructor(
    @InjectModel(Suppliers.name) private SupplierModel: Model<Suppliers>,
  ) {}
  async create(createSupplierDto: CreateSupplierDto) {
    const createdSupplier = await this.SupplierModel.findOne({
      name: createSupplierDto.name,
    });
    if (createdSupplier) {
      throw new HttpException('Supplier already exists', 400);
    }
    const newSupplier = await this.SupplierModel.create(createSupplierDto);
    return {
      status: 200,
      message: 'Supplier created successfully',
      data: newSupplier,
    };
  }

  async findAll() {
    const suppliers = await this.SupplierModel.find().select('-__v');
    return {
      status: 200,
      message: 'Suppliers retrieved successfully',
      data: suppliers,
    };
  }

  async findOne(id: string) {
    const supplier = await this.SupplierModel.findById(id).select('-__v');
    if (!supplier) {
      throw new HttpException('Supplier not found', 404);
    }
    return {
      status: 200,
      message: 'Supplier retrieved successfully',
      data: supplier,
    };
  }

  async update(id: string, updateSupplierDto: UpdateSupplierDto) {
    const existsSupplier = await this.SupplierModel.findById(id).select('-__v');
    if (!existsSupplier) {
      throw new HttpException('Supplier not found', 404);
    }
    const updatedSupplier = await this.SupplierModel.findByIdAndUpdate(
      id,
      updateSupplierDto,
      {
        new: true,
      },
    );
    return {
      status: 200,
      message: 'Supplier updated successfully',
      data: updatedSupplier,
    };
  }

  async remove(id: string) {
    const existsSupplier = await this.SupplierModel.findById(id).select('-__v');
    if (!existsSupplier) {
      throw new HttpException('Supplier not found', 404);
    }
    await this.SupplierModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'Supplier deleted successfully',
    };
  }
}
