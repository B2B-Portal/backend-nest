import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Название категории',
    example: 'Одежда',
  })
  @IsString()
  @IsNotEmpty()
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
  parent?: CreateCategoryDto;
}
