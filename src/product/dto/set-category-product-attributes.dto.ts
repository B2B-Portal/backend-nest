import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class SetCategoryProductAttributeItemDto {
  @ApiProperty({
    description: 'Attribute id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  attributeId: number;

  @ApiProperty({
    description: 'Is this attribute required in category',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  required?: boolean;

  @ApiProperty({
    description: 'Can this attribute be used in product variants',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  useInVariants?: boolean;

  @ApiProperty({
    description: 'Can this attribute be used in storefront filtering',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  filterable?: boolean;

  @ApiProperty({
    description: 'Sort order in category forms and filters',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;
}

export class SetCategoryProductAttributesDto {
  @ApiProperty({
    description: 'Attribute rules for category',
    type: [SetCategoryProductAttributeItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SetCategoryProductAttributeItemDto)
  items: SetCategoryProductAttributeItemDto[];
}
