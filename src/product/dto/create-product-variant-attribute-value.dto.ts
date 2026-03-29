import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateProductVariantAttributeValueDto {
  @ApiProperty({
    description: 'Product attribute id',
    example: 1,
  })
  @IsNumber()
  @IsNotEmpty()
  attributeId: number;

  @ApiProperty({
    description: 'Attribute option id (for select type attributes)',
    example: 12,
    required: false,
  })
  @IsOptional()
  @ValidateIf((valueDto) => !valueDto.rawValue)
  @IsNumber()
  optionId?: number;

  @ApiProperty({
    description: 'Raw value when option is not used',
    example: '6.7',
    required: false,
  })
  @IsOptional()
  @ValidateIf((valueDto) => !valueDto.optionId)
  @IsString()
  rawValue?: string;
}
