import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserInput {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    format: 'email',
  })
  @IsNotEmpty()
  @IsEmail(null, { message: 'Please provide a valid Email.' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'SecurePassword123!',
    minLength: 8,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'FirstName must have at least 2 characters.' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Петров',
    minLength: 3,
  })
  @IsNotEmpty()
  @MinLength(3, { message: 'LastName must have at least 3 characters.' })
  lastName: string;

  @ApiProperty({
    description: 'Название компании',
    example: 'ООО "Рога и копыта"',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'СompanyName must have at least 2 characters.' })
  @IsNotEmpty()
  companyName: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+7 (999) 123-45-67',
  })
  @IsString()
  @IsNotEmpty()
  phone: string;
}