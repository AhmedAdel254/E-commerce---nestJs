import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateRequestProductDto {
  //titleNeed
  @IsString({ message: 'titleNeed must be a string' })
  titleNeed: string;
  //details
  @IsString({ message: 'details must be a string' })
  @MinLength(5, { message: 'details is too short' })
  details: string;
  //quantity
  @IsNumber({}, { message: 'quantity must be a number' })
  @Min(1, { message: 'quantity must be at least 1 product' })
  quantity: number;
  //catecory
  @IsString({ message: 'catecory must be a string' })
  @IsOptional()
  catecory: string;
  //user
  @IsString({ message: 'user must be a string' })
  @IsOptional()
  @IsMongoId() //34an p refer to user
  user: string;
}
