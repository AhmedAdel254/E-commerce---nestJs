import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateReviewDto {
  //reviewText: string;
  @IsString({ message: 'reviewText must be a string' })
  @MinLength(3, { message: 'reviewText is too short' })
  @IsOptional()
  reviewText: string;
  //rating: number;
  @IsNumber({}, { message: 'rating must be a number' })
  @Min(1, { message: 'rating must be at least 1' })
  @Max(5, { message: 'rating must be at most 5' })
  rating: number;
  //product: string;
  @IsString({ message: 'product must be a string' })
  @IsMongoId({ message: 'product must be a valid mongo id' })
  product: string;
}
