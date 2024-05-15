import { Field, InputType } from '@nestjs/graphql';
import { IsString, Length, Matches } from 'class-validator';

@InputType()
export class SignupUserInput {
  @Field()
  @IsString()
  @Length(4, 50)
  email: string;

  @Field()
  @IsString()
  @Length(8, 50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;

  @Field()
  @IsString()
  @Length(2, 50)
  firstName: string;

  @Field()
  @IsString()
  @Length(2, 50)
  lastName: string;

  @Field()
  @IsString()
  @Length(5, 20)
  phone: string;

  @Field()
  @IsString()
  @Length(2, 50)
  companyName: string;
}