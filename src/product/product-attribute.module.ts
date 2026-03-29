import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAttributeController } from './product-attribute.controller';
import { ProductAttributeService } from './product-attribute.service';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeOption } from './entities/product-attribute-option.entity';
import { CategoryProductAttribute } from './entities/category-product-attribute.entity';
import { Category } from '../category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductAttribute,
      ProductAttributeOption,
      CategoryProductAttribute,
      Category,
    ]),
  ],
  controllers: [ProductAttributeController],
  providers: [ProductAttributeService],
  exports: [ProductAttributeService],
})
export class ProductAttributeModule {}
