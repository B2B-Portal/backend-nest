import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide a valid Email.' })
  email: string;

  @Field(() => String)
  @IsNotEmpty()
  password: string;

  @Field(() => String)
  @IsString()
  @MinLength(2, { message: 'FirstName must have at least 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @Field(() => String)
  @IsNotEmpty()
  @MinLength(3, { message: 'LastName must have at least 3 characters.' })
  lastName: string;

  @Field(() => String)
  @IsString()
  @MinLength(2, { message: 'СompanyName must have at least 2 characters.' })
  @IsNotEmpty()
  companyName: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  phone: string;
}
