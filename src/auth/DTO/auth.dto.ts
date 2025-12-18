import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthDto {
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
}

export class SignInDto {
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
}
export class resetDTO {
  //email
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(0, { message: 'Email is too short' })
  email: string;
}

export class verifyDTO {
  //code
  @IsString({ message: 'Code must be a string' })
  @MinLength(3, { message: 'Code is too short' })
  @MaxLength(10, { message: 'Code is too long' })
  code: string;
  //email
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(0, { message: 'Email is too short' })
  email: string;
}

export class newPassDTO {
  //password
  @IsString({ message: 'Password must be a string' })
  @MinLength(3, { message: 'Password is too short' })
  @MaxLength(20, { message: 'Password is too long' })
  password: string;
  //email
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @MinLength(0, { message: 'Email is too short' })
  email: string;
}
