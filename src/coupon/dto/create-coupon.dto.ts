import {
  IsDateString,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateCouponDto {
  //name
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(100, { message: 'Name is too long' })
  name: string;
  //expired data
  @IsString({ message: 'Expired must be a string' })
  @IsDateString({}, { message: 'Expired must be a date' }) // handel date => 2025-01-01
  expiryDate: string;
  //discount
  @IsNumber({}, { message: 'Discount must be a number' })
  @Min(0, { message: 'Discount is too short' })
  discount: number;
}
