import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub_category.service';
import { SubCategoryController } from './sub_category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SubCategory, SubCategorySchema } from './subCategory.schema';
import { Category, CategorySchema } from 'src/category/category.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SubCategory.name, schema: SubCategorySchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}
