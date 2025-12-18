import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  //admin can create product
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  //any user can get all products
  @Get()
  findAll(@Query() query) {
    return this.productService.findAll(query);
  }
  //any user can get one product
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }
  // admin only can update
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
