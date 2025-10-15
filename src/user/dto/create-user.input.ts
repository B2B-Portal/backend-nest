import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserInput {
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide a valid Email.' })
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @MinLength(2, { message: 'FirstName must have at least 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  @MinLength(3, { message: 'LastName must have at least 3 characters.' })
  lastName: string;

  @IsString()
  @MinLength(2, { message: 'СompanyName must have at least 2 characters.' })
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
