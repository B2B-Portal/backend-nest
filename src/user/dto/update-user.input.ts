import { ApiProperty } from '@nestjs/swagger';
import Status from '../enums/status.enum';
import { CreateUserInput } from './create-user.input';
import { PartialType } from '@nestjs/mapped-types';
import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsEnum,
} from 'class-validator';

export class UpdateUserInput extends PartialType(CreateUserInput) {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail(null, { message: 'Please provide a valid Email.' })
  email: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Иван',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'FirstName must have at least 2 characters.' })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Петров',
    minLength: 3,
  })
  @IsOptional()
  @MinLength(3, { message: 'LastName must have at least 3 characters.' })
  lastName: string;

  @ApiProperty({
    description: 'Название компании',
    example: 'ООО "Рога и копыта"',
    minLength: 2,
  })
  @IsString()
  @MinLength(2, { message: 'СompanyName must have at least 2 characters.' })
  @IsOptional()
  companyName: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+7 (999) 123-45-67',
  })
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({
    description: 'Статус пользователя',
    example: Status.INREVIEW,
  })
  @IsEnum(Status, { message: 'Invalid status' })
  @IsOptional()
  status?: Status;
}
