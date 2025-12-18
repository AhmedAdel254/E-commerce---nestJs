import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  Length,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  //name
  @IsString({ message: 'Name must be a string' })
  @MinLength(3, { message: 'Name is too short' })
  @MaxLength(20, { message: 'Name is too long' })
  name: string;
  //email
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(0, { message: 'Email is too short' })
  email: string;
  //password
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'Password is too short' })
  @MaxLength(20, { message: 'Password is too long' })
  password: string;
  //role
  @IsEnum(['admin', 'user'], { message: 'Role must be admin or user' })
  @MinLength(0, { message: 'Role must be reqired' })
  @IsOptional()
  role: string;
  //avatar
  @IsString({ message: 'Avatar must be a string' })
  @IsUrl({}, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar: string;
  //age
  @IsNumber({}, { message: 'Age must be a number' })
  @Min(18, { message: 'Age must be at least 18' })
  @IsOptional()
  age: number;
  //phone number
  @IsString({ message: 'Phone number must be a string' })
  @IsPhoneNumber('EG', { message: 'Phone number must be a number' })
  @IsOptional()
  phoneNumber: string;
  //address
  @IsString({ message: 'Address must be a string' })
  @IsOptional()
  address: string;
  //is active
  @IsEnum([false, true], { message: 'Active must be true or false' })
  @IsBoolean({ message: 'Active must be a boolean' })
  @IsOptional()
  active: boolean;
  //verification code
  @IsString({ message: 'Verification code must be a string' })
  @Length(6, 6, { message: 'Verification code must be 6 characters long' })
  @IsOptional()
  VerificationCode: string;
  //gender
  @IsEnum(['male', 'female'], { message: 'Gender must be male or female' })
  @IsOptional()
  gender: string;
}
