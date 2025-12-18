import { IsNumber, Max, Min } from 'class-validator';

export class CreateCartDto {
  @IsNumber({}, { message: 'Quantity must be a number' })
  @Min(1, { message: 'Quantity must be at least 1 product' })
  @Max(500, { message: 'Quantity must be at most 1000 product' })
  quantity: number;
}
