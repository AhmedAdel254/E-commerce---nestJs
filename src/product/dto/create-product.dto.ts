import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  //title: string;
  @IsString({ message: 'title must be a string' })
  @MinLength(3, { message: 'title is too short' })
  title: string;
  //description: string;
  @IsString({ message: 'description must be a string' })
  @MinLength(20, { message: 'description is too short' })
  description: string;
  //quantity: number;
  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be at least 1 product' })
  @Max(500, { message: 'quantity must be at most 1000 product' })
  quantity: number;
  //imageCover: string;
  @IsString({ message: 'imageCover must be a string' })
  @IsUrl({}, { message: 'imageCover must be a valid URL' })
  imageCover: string;
  //images: string[];
  @IsArray({ message: 'images must be an array' })
  @IsOptional()
  images: string;
  //sold: number;
  @IsNumber({}, { message: 'sold must be a number' })
  @IsOptional()
  sold: number;
  //price: number;
  @IsNumber({}, { message: 'price must be a number' })
  @Min(0, { message: 'price must be at least 0' })
  @Max(200000, { message: 'price must be at most 1000000' })
  price: number;
  //price after discount: number;
  @IsNumber({}, { message: 'price after discount must be a number' })
  @Min(0, { message: 'price after discount must be at least 0' })
  @Max(200000, { message: 'price after discount must be at most 1000000' })
  priceAfterDiscount: number;
  //coler: string;
  @IsArray({ message: 'coler must be an array' })
  @IsOptional()
  coler: string;
  //category: string;
  @IsString({ message: 'category must be a string' })
  @IsMongoId({ message: 'category must be a valid mongo id' })
  category: string;
  //sub category: string;
  @IsString({ message: 'sub category must be a string' })
  @IsMongoId({ message: 'sub category must be a valid mongo id' })
  @IsOptional()
  subCategory: string;
  //brand: string;
  @IsString({ message: 'brand must be a string' })
  @IsMongoId({ message: ' brand must be a valid mongo id' })
  @IsOptional()
  brand: string;
}
