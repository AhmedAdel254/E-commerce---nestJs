import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './DTO/category.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';
import { UpdateUserDto } from './DTO/updateCtecory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // Create a new category
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  createCategory(@Body() categorydto: CreateCategoryDto) {
    return this.categoryService.createCategory(categorydto);
  }
  // get all categories
  @Get()
  getAllCategories(@Query() query) {
    return this.categoryService.getAllCategories(query);
  }

  //get single category by id
  @Get(':id')
  getsingleCategories(@Param('id') id: string) {
    return this.categoryService.getsingleCategories(id);
  }

  // Update a new category
  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  updateCategory(@Body() updatedto: UpdateUserDto, @Param('id') id: string) {
    return this.categoryService.updateCategory(updatedto, id);
  }

  // Delete a category
  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  removeCategory(@Param('id') id: string) {
    return this.categoryService.removeCategory(id);
  }
}
