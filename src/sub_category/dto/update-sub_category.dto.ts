import { PartialType } from '@nestjs/mapped-types';
import { createSubCategoryDto } from './create-sub_category.dto';

export class UpdateSubCategoryDto extends PartialType(createSubCategoryDto) {}
