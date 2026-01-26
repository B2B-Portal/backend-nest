import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { SigninResponse } from './dto/signin-response.dto';
import { SignupResponse } from './dto/signup-response.dto';
import { SignupUserInput } from './dto/signup-user.input';
import { SigninUserInput } from './dto/singin-user.input';
import { User } from 'src/user/entities/user.entity';
import { CurrentUser } from './decorators/get-current-user.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('sign-up')
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  @ApiBody({ type: SignupUserInput })
  @ApiResponse({
    status: 201,
    description: 'Пользователь успешно зарегистрирован',
    type: SignupResponse,
  })
  @ApiResponse({ status: 400, description: 'Неверные данные' })
  async signup(
    @Body() signupUserInput: SignupUserInput,
  ): Promise<SignupResponse> {
    return this.authService.signup(signupUserInput);
  }

  @Post('sign-in')
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiBody({ type: SigninUserInput })
  @ApiResponse({
    status: 200,
    description: 'Успешный вход в систему',
    type: SigninResponse,
  })
  @ApiResponse({ status: 401, description: 'Неверные учетные данные' })
  async signin(
    @Body() signinUserInput: SigninUserInput,
  ): Promise<SigninResponse> {
    return this.authService.signin(signinUserInput);
  }
}
