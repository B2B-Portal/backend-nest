import { CreateUserInput } from './create-user.input';
import { PartialType } from '@nestjs/mapped-types';
import Status from '../enums/status.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserInput extends PartialType(CreateUserInput) {
  @ApiProperty({
    description: 'Статус пользователя',
    example: Status.INREVIEW,
  })
  @IsEnum(Status, { message: 'Invalid status' })
  @IsOptional()
  status: Status;
}
