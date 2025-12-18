/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { stat } from 'fs';
const sault = 10;

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  //
  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) {
      throw new HttpException('User already exist', 400);
    }
    const password = await bcrypt.hash(createUserDto.password, sault);
    const user = {
      password,
      role: createUserDto.role ?? 'user',
      active: true,
    };

    return {
      status: 200,
      message: 'User created successfully',
      data: await this.userModel.create({ ...createUserDto, ...user }),
    };
  }

  async findAll(query) {
    const {
      limit = 1000000,
      skip = 0,
      sort = 'asc',
      name,
      email,
      role,
    } = query;
    if (Number.isNaN(Number(+limit))) {
      throw new HttpException('Limit must be a number', 400);
    }
    if (Number.isNaN(Number(+skip))) {
      throw new HttpException('skip must be a number', 400);
    }
    if (sort !== 'asc' && sort !== 'desc' && sort !== undefined) {
      throw new HttpException('Sort must be asc or desc', 400);
    }
    const users = await this.userModel
      .find()
      .limit(limit)
      .skip(skip)
      .where('name', new RegExp(name, 'i'))
      .where('email', new RegExp(email, 'i'))
      .where('role', new RegExp(role, 'i'))
      .sort({ name: sort })
      .select('-password -__v')
      .exec();
    return {
      status: 200,
      message: 'Users retrieved successfully',
      length: users.length,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.userModel
      .findById(id)
      .select('-password -__v');
    if (!userExist) {
      throw new HttpException('User not found', 404);
    }
    if (updateUserDto.password) {
      const password = await bcrypt.hash(updateUserDto.password, sault);
      updateUserDto.password = password;
    }
    return {
      status: 200,
      message: 'User updated successfully',
      data: await this.userModel.findByIdAndUpdate(id, updateUserDto, {
        new: true,
      }),
    };
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    await this.userModel.findByIdAndDelete(id);
    return {
      status: 200,
      message: 'User deleted successfully',
    };
  }
  // ================== Profile for logged in user ===================
  async getProfile(id: string) {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return {
      status: 200,
      message: 'User profile retrieved successfully',
      data: user,
    };
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    const userExist = await this.userModel
      .findById(id)
      .select('-password -__v');
    if (!userExist) {
      throw new HttpException('User not found', 404);
    }
    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, {
        new: true,
      })
      .select('-password -__v');
    return {
      status: 200,
      message: 'User profile updated successfully',
      data: user,
    };
  }

  async removeProfile(id: string) {
    const user = await this.userModel.findById(id).select('-password -__v');
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    const userDeleted = await this.userModel.findByIdAndUpdate(
      id,
      { active: false },
      { new: true },
    );
    return {
      status: 200,
      message: 'User profile deleted successfully',
      data: userDeleted,
    };
  }
}
