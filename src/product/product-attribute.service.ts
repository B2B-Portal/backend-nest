import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeOption } from './entities/product-attribute-option.entity';
import { CategoryProductAttribute } from './entities/category-product-attribute.entity';
import { Category } from '../category/entities/category.entity';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { CreateProductAttributeOptionDto } from './dto/create-product-attribute-option.dto';
import { SetCategoryProductAttributesDto } from './dto/set-category-product-attributes.dto';

@Injectable()
export class ProductAttributeService {
  constructor(
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(ProductAttributeOption)
    private productAttributeOptionRepository: Repository<ProductAttributeOption>,
    @InjectRepository(CategoryProductAttribute)
    private categoryProductAttributeRepository: Repository<CategoryProductAttribute>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async createAttribute(createProductAttributeDto: CreateProductAttributeDto) {
    const existing = await this.productAttributeRepository.findOne({
      where: { code: createProductAttributeDto.code },
    });
    if (existing) {
      throw new ConflictException(
        `Attribute code "${createProductAttributeDto.code}" already exists`,
      );
    }

    const attribute = this.productAttributeRepository.create(
      createProductAttributeDto,
    );
    return this.productAttributeRepository.save(attribute);
  }

  async findAllAttributes() {
    return this.productAttributeRepository.find({
      relations: ['options'],
      order: {
        id: 'ASC',
      },
    });
  }

  async findAttribute(attributeId: number) {
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId },
      relations: ['options'],
    });
    if (!attribute) {
      throw new NotFoundException(`Attribute ${attributeId} does not exist`);
    }
    return attribute;
  }

  async addOption(
    attributeId: number,
    createProductAttributeOptionDto: CreateProductAttributeOptionDto,
  ) {
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute) {
      throw new NotFoundException(`Attribute ${attributeId} does not exist`);
    }

    const existing = await this.productAttributeOptionRepository.findOne({
      where: {
        attribute: { id: attributeId },
        value: createProductAttributeOptionDto.value,
      },
      relations: ['attribute'],
    });
    if (existing) {
      throw new ConflictException(
        `Option "${createProductAttributeOptionDto.value}" already exists for this attribute`,
      );
    }

    const option = this.productAttributeOptionRepository.create({
      ...createProductAttributeOptionDto,
      attribute,
    });
    return this.productAttributeOptionRepository.save(option);
  }

  async getAttributeOptions(attributeId: number) {
    await this.ensureAttributeExists(attributeId);
    return this.productAttributeOptionRepository.find({
      where: { attribute: { id: attributeId } },
      relations: ['attribute'],
      order: { sortOrder: 'ASC', id: 'ASC' },
    });
  }

  async setCategoryAttributes(
    categoryId: number,
    setCategoryProductAttributesDto: SetCategoryProductAttributesDto,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryId} does not exist`);
    }

    await this.categoryProductAttributeRepository
      .createQueryBuilder()
      .delete()
      .from(CategoryProductAttribute)
      .where('"category_id" = :categoryId', { categoryId })
      .execute();

    const links: CategoryProductAttribute[] = [];
    for (const item of setCategoryProductAttributesDto.items) {
      const attribute = await this.productAttributeRepository.findOne({
        where: { id: item.attributeId },
      });
      if (!attribute) {
        throw new NotFoundException(`Attribute ${item.attributeId} does not exist`);
      }

      links.push(
        this.categoryProductAttributeRepository.create({
          category,
          attribute,
          required: item.required ?? false,
          useInVariants: item.useInVariants ?? true,
          filterable: item.filterable ?? true,
          sortOrder: item.sortOrder ?? 0,
        }),
      );
    }

    await this.categoryProductAttributeRepository.save(links);
    return this.getCategoryAttributes(categoryId);
  }

  async getCategoryAttributes(categoryId: number) {
    return this.categoryProductAttributeRepository.find({
      where: { category: { id: categoryId } },
      relations: ['category', 'attribute', 'attribute.options'],
      order: {
        sortOrder: 'ASC',
        id: 'ASC',
      },
    });
  }

  private async ensureAttributeExists(attributeId: number) {
    const attribute = await this.productAttributeRepository.findOne({
      where: { id: attributeId },
    });
    if (!attribute) {
      throw new NotFoundException(`Attribute ${attributeId} does not exist`);
    }
    return attribute;
  }
}
