import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductVariantDto } from './create-product-variant.dto';

export class CreateProductDto {
  @ApiProperty({
    description: 'SKU of the product',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'Name of the product',
    example: 'Product 1',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Description of the product',
    example: 'Product 1 description',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'Price of the product',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({
    description: 'Quantity of the product',
    example: 100,
  })
  @IsNumber()
  @IsOptional()
  quantity: number;

  @ApiProperty({
    description: 'Image of the product',
    example: 'https://example.com/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  image: string;

  @ApiProperty({
    description: 'Category of the product',
    example: {
      id: 1,
    },
  })
  @IsOptional()
  category: Category;

  @ApiProperty({
    description: 'Product variants for different attribute combinations',
    required: false,
    type: [CreateProductVariantDto],
    example: [
      {
        sku: 'IPHONE-15-BLACK-128',
        price: 899,
        quantity: 12,
        attributeValues: [
          { attributeId: 1, optionId: 10 },
          { attributeId: 2, optionId: 21 },
        ],
      },
      {
        sku: 'IPHONE-15-BLUE-256',
        price: 999,
        quantity: 5,
        attributeValues: [
          { attributeId: 1, optionId: 11 },
          { attributeId: 2, optionId: 22 },
        ],
      },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantDto)
  variants?: CreateProductVariantDto[];
}
