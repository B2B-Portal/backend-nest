import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiProperty({
    description: 'Название категории',
    example: 'Одежда',
  })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({
    description: 'Slug категории',
    example: 'clothing',
  })
  @IsString()
  @IsOptional()
  slug: string;

  @ApiProperty({
    description: 'Описание категории',
    example: 'Одежда для всех возрастов',
  })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    description: 'Контент категории',
    example: 'Контент категории',
  })
  @IsString()
  @IsOptional()
  content: string;

  @ApiProperty({
    description: 'Изображение категории',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsOptional()
  image: string;

  @ApiProperty({
    description: 'Родительская категория',
    example: {
      id: 1,
    },
  })
  @IsOptional()
  parent?: UpdateCategoryDto;
}
