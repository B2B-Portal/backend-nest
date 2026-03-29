import {
  Column,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductAttributeOption } from './product-attribute-option.entity';
import { CategoryProductAttribute } from './category-product-attribute.entity';
import { ProductVariantAttributeValue } from './product-variant-attribute-value.entity';

@Entity()
export class ProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ default: 'select' })
  type: string;

  @Column({ default: true })
  isFilterable: boolean;

  @OneToMany(() => ProductAttributeOption, (option) => option.attribute)
  options: ProductAttributeOption[];

  @OneToMany(() => CategoryProductAttribute, (item) => item.attribute)
  categoryLinks: CategoryProductAttribute[];

  @OneToMany(() => ProductVariantAttributeValue, (value) => value.attribute)
  variantValues: ProductVariantAttributeValue[];

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}
