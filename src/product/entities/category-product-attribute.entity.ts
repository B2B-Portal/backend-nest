import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { ProductAttribute } from './product-attribute.entity';

@Entity()
@Unique(['category', 'attribute'])
export class CategoryProductAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category, (category) => category.productAttributes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => ProductAttribute, (attribute) => attribute.categoryLinks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'attribute_id' })
  attribute: ProductAttribute;

  @Column({ default: false })
  required: boolean;

  @Column({ default: true })
  useInVariants: boolean;

  @Column({ default: true })
  filterable: boolean;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;
}
