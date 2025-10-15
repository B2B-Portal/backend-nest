import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { SigninResponse } from './dto/signin-response.dto';
import { SignupResponse } from './dto/signup-response.dto';
import { SignupUserInput } from './dto/signup-user.input';
import { SigninUserInput } from './dto/singin-user.input';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signup(signupUserInput: SignupUserInput): Promise<SignupResponse> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(signupUserInput.password, salt);
    signupUserInput.password = hashedPassword;

    const user = await this.userService.createUser(signupUserInput);

    // Возвращаем только нужные поля без пароля
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      companyName: user.companyName,
    };
  }

  async signin(signinUserInput: SigninUserInput): Promise<SigninResponse> {
    const { email, password } = signinUserInput;
    const user = await this.validateUser(email, password);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { access_token: accessToken, email: email };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.getUser(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    throw new UnauthorizedException();
  }
}
