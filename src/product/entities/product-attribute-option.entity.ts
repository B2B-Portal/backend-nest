import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Unique,
  OneToMany,
} from 'typeorm';
import { ProductAttribute } from './product-attribute.entity';
import { ProductVariantAttributeValue } from './product-variant-attribute-value.entity';

@Entity()
@Unique(['attribute', 'value'])
export class ProductAttributeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  value: string;

  @Column({ nullable: true })
  label: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.options, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: ProductAttribute;

  @OneToMany(() => ProductVariantAttributeValue, (value) => value.option)
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
