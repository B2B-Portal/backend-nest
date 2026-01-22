import { ApiProperty } from "@nestjs/swagger";
import { Category } from "../../category/entities/category.entity";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

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
}
