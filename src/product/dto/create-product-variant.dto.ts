import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateProductVariantAttributeValueDto } from './create-product-variant-attribute-value.dto';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'SKU of the variant',
    example: 'IPHONE-15-BLACK-128',
    required: false,
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({
    description: 'Price of the variant',
    example: 999,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({
    description: 'Quantity of the variant',
    example: 5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiProperty({
    description: 'Variant image',
    example: 'https://example.com/iphone-black.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Attribute values selected for this variant',
    type: [CreateProductVariantAttributeValueDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProductVariantAttributeValueDto)
  attributeValues?: CreateProductVariantAttributeValueDto[];
}
