import { IsString, IsUrl, MaxLength, MinLength } from 'class-validator';

export class CreateSupplierDto {
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(100, { message: 'Name is too long' })
  name: string;

  @IsString({ message: 'Address must be a string' })
  @IsUrl({}, { message: 'Address must be a valid URL' })
  website: string;
}
