import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateMediaDto {
  @ApiProperty({
    description: 'Target bucket name (overrides S3_BUCKET)',
    required: false,
    example: 'products-prod',
  })
  @IsOptional()
  @IsString()
  bucket?: string;

  @ApiProperty({
    description: 'Logical storage folder',
    enum: ['products', 'categories'],
    required: false,
    example: 'products',
  })
  @IsOptional()
  @IsString()
  @IsIn(['products', 'categories'])
  folder?: 'products' | 'categories';
}
