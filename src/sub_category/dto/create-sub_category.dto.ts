import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';

export class createSubCategoryDto {
  //name
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(20, { message: 'Name is too long' })
  name: string;
  //categoryId
  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'category must be a valid mongo id' })
  category: string;
  titleNeed: unknown;
  user: unknown;
}
