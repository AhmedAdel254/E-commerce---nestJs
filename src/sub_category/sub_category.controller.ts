import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { createSubCategoryDto } from './dto/create-sub_category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub_category.dto';
import { Roles } from 'src/decorator/roles.decorator';
import { AuthGuard } from 'guard/auth.guard';

@Controller('sub-category')
export class SubCategoryController {
  constructor(private readonly subCategoryService: SubCategoryService) {}
  //add subCategory
  @Post()
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  create(@Body() createSubCategoryDto: createSubCategoryDto) {
    return this.subCategoryService.create(createSubCategoryDto);
  }
  //get all subCategory
  @Get()
  findAll(@Query() query) {
    return this.subCategoryService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subCategoryService.findOne(id);
  }

  @Patch(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  update(
    @Param('id') id: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
  ) {
    return this.subCategoryService.update(id, updateSubCategoryDto);
  }

  @Delete(':id')
  @Roles(['admin'])
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.subCategoryService.remove(id);
  }
}
