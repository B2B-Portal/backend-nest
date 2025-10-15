import { IsString, Length, Matches } from 'class-validator';

export class SigninUserInput {
  @IsString()
  @Length(4, 20)
  email: string;

  @IsString()
  @Length(8, 50)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
