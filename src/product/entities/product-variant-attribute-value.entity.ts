import {
  Column,
  Entity,
  Unique,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariant } from './product-variant.entity';
import { ProductAttributeOption } from './product-attribute-option.entity';

@Entity()
@Unique(['variant', 'attribute'])
export class ProductVariantAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProductVariant, (variant) => variant.attributeValues, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.variantValues, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: ProductAttribute;

  @ManyToOne(() => ProductAttributeOption, (option) => option.variantValues, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'option_id' })
  option: ProductAttributeOption;

  @Column({ nullable: true })
  rawValue: string;
}
