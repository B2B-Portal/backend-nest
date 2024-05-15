import { UseGuards } from '@nestjs/common';
import { Args, Context, GqlContextType, Mutation, Resolver } from '@nestjs/graphql';

import { AuthService } from './auth.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';

import { SigninResponse } from './dto/signin-response';
import { SigninUserInput } from './dto/singin-user.input';
import { SignupResponse } from './dto/signup-response';
import { SignupUserInput } from './dto/signup-user.input';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from './decorators/get-current-user.decorator';

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

  // TODO: remove in future
  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async protectedResource(@Context() context: GqlContextType, @CurrentUser() user: User) {
    return 'This is a protected resource!';
  }
}
