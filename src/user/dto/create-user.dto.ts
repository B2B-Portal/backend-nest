import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import Role from '../enums/roles.enum';
import Status from '../enums/status.enum';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email пользователя',
    example: 'user@example.com',
    format: 'email',
    maxLength: 50,
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please provide a valid email.' })
  @MaxLength(50, { message: 'Email must have at most 50 characters.' })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя',
    example: 'SecurePassword123!',
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    description: 'Имя пользователя',
    example: 'Ivan',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2, { message: 'First name must have at least 2 characters.' })
  @MaxLength(50, { message: 'First name must have at most 50 characters.' })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Фамилия пользователя',
    example: 'Petrov',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2, { message: 'Last name must have at least 2 characters.' })
  @MaxLength(50, { message: 'Last name must have at most 50 characters.' })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'Номер телефона',
    example: '+7 (999) 123-45-67',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50, { message: 'Phone must have at most 50 characters.' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'Название компании',
    example: 'Katel LLC',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50, { message: 'Company name must have at most 50 characters.' })
  @IsNotEmpty()
  companyName: string;

  @ApiPropertyOptional({
    description: 'Адрес',
    example: 'Main street 1',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'Address must have at most 50 characters.' })
  address?: string;

  @ApiPropertyOptional({
    description: 'Город',
    example: 'Moscow',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50, { message: 'City must have at most 50 characters.' })
  city?: string;

  @ApiPropertyOptional({
    description: 'Статус пользователя',
    enum: Status,
    example: Status.INREVIEW,
  })
  @IsOptional()
  @IsEnum(Status, { message: 'Invalid status.' })
  status?: Status;

  @ApiPropertyOptional({
    description: 'Роль пользователя',
    enum: Role,
    example: Role.USER,
  })
  @IsOptional()
  @IsEnum(Role, { message: 'Invalid role.' })
  role?: Role;
}
