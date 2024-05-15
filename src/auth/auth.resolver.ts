import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';

import { SigninResponse } from './dto/signin-response';
import { SigninUserInput } from './dto/singin-user.input';
import { SignupResponse } from './dto/signup-response';
import { SignupUserInput } from './dto/signup-user.input';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => SignupResponse)
  async signup(
    @Args('signupUserInput') signupUserInput: SignupUserInput,
  ): Promise<SignupResponse> {
    return this.authService.signup(signupUserInput);
  }

  @Mutation(() => SigninResponse)
  async signin(
    @Args('signinUserInput') signinUserInput: SigninUserInput,
  ): Promise<SigninResponse> {
    return this.authService.signin(signinUserInput);
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async protectedResource(@Context() context) {
    return 'This is a protected resource!';
  }
}
