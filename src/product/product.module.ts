import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Category } from 'src/category/entities/category.entity';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeOption } from './entities/product-attribute-option.entity';
import { ProductVariantAttributeValue } from './entities/product-variant-attribute-value.entity';
import { CategoryProductAttribute } from './entities/category-product-attribute.entity';
import { MediaModule } from 'src/media/media.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      ProductVariant,
      ProductAttribute,
      ProductAttributeOption,
      ProductVariantAttributeValue,
      CategoryProductAttribute,
    ]),
    MediaModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule {}
