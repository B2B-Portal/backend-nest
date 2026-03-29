import {
  Column,
  Entity,
  OneToMany,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { ProductVariantAttributeValue } from './product-variant-attribute-value.entity';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ type: 'int', default: 0 })
  quantity: number;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => Product, (product) => product.variants, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @OneToMany(
    () => ProductVariantAttributeValue,
    (attributeValue) => attributeValue.variant,
    {
      cascade: true,
      orphanedRowAction: 'delete',
    },
  )
  attributeValues: ProductVariantAttributeValue[];
}
