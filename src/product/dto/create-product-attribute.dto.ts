import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateProductAttributeDto {
  @ApiProperty({
    description: 'Unique attribute code',
    example: 'color',
  })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({
    description: 'Display name in admin panel',
    example: 'Color',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Attribute type',
    example: 'select',
    required: false,
  })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({
    description: 'Can this attribute be used in storefront filters',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isFilterable?: boolean;
}
