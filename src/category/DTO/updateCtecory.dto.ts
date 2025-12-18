import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './category.dto';

export class UpdateUserDto extends PartialType(CreateCategoryDto) {}
