import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateCategoryDto {
  //name
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(20, { message: 'Name is too long' })
  name: string;
  //image
  @IsString({ message: 'Image must be a string' })
  @IsUrl({}, { message: 'Image must be a valid URL' })
  image: string;
}
