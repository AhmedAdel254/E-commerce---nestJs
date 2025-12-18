/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpException,
} from '@nestjs/common';
import { RequestProductService } from './request-product.service';
import { CreateRequestProductDto } from './dto/create-request-product.dto';
import { UpdateRequestProductDto } from './dto/update-request-product.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('request-product')
export class RequestProductController {
  constructor(private readonly requestProductService: RequestProductService) {}
  //user can create request
  @Post()
  @Roles(['user'])
  @UseGuards(AuthGuard)
  create(@Body() createRequestProductDto: CreateRequestProductDto, @Req() req) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    return this.requestProductService.create({
      ...createRequestProductDto,
      user: req.user._id,
    });
  }
  //admin can see all request
  @Get()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  findAll() {
    return this.requestProductService.findAll();
  }

  //admin can see one request
  @Get(':id')
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard)
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.requestProductService.findOne(id, req);
  }

  //user can update his request
  @Patch(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateRequestProductDto: UpdateRequestProductDto,
    @Req() req: any,
  ) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    return this.requestProductService.update(id, {
      ...updateRequestProductDto,
      user: req.user._id,
    });
  }

  @Delete(':id')
  @Roles(['user'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.role.toLowerCase() === 'admin') {
      throw new HttpException('Admin can not create request product', 400);
    }
    const user_id = req.user._id;
    return this.requestProductService.remove(id, user_id);
  }
}
