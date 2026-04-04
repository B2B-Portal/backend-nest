import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductVariant } from './entities/product-variant.entity';
import { ProductAttribute } from './entities/product-attribute.entity';
import { ProductAttributeOption } from './entities/product-attribute-option.entity';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { CreateProductVariantAttributeValueDto } from './dto/create-product-variant-attribute-value.dto';
import { ProductVariantAttributeValue } from './entities/product-variant-attribute-value.entity';
import { CategoryProductAttribute } from './entities/category-product-attribute.entity';
import { Category } from '../category/entities/category.entity';
import { MediaService } from '../media/media.service';

type ProductFilterMap = Record<
  string,
  Array<string | number>
>;

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductAttribute)
    private productAttributeRepository: Repository<ProductAttribute>,
    @InjectRepository(ProductAttributeOption)
    private productAttributeOptionRepository: Repository<ProductAttributeOption>,
    @InjectRepository(CategoryProductAttribute)
    private categoryProductAttributeRepository: Repository<CategoryProductAttribute>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly mediaService: MediaService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { variants, category, ...productData } = createProductDto;
    const resolvedCategory = await this.resolveCategoryOrThrow(category);
    const product = this.productRepository.create({
      ...productData,
      category: resolvedCategory,
    });
    if (variants?.length) {
      product.variants = await this.buildVariants(variants);
    }
    const savedProduct = await this.productRepository.save(product);
    this.normalizeProductImages(savedProduct);
    return savedProduct;
  }

  async findAll() {
    const products = await this.productRepository.find({
      relations: [
        'category',
        'variants',
        'variants.attributeValues',
        'variants.attributeValues.attribute',
        'variants.attributeValues.option',
      ],
    });
    products.forEach((product) => this.normalizeProductImages(product));
    return products;
  }

  async getFilters(categoryId?: number) {
    const where = categoryId ? { category: { id: categoryId } } : {};
    const products = await this.productRepository.find({
      where,
      relations: [
        'category',
        'variants',
        'variants.attributeValues',
        'variants.attributeValues.attribute',
        'variants.attributeValues.option',
      ],
    });

    const filters = new Map<string, Set<string | number>>();
    const pushValue = (key: string, value: string | number | null | undefined) => {
      if (value === null || value === undefined || key.length === 0) {
        return;
      }
      if (!filters.has(key)) {
        filters.set(key, new Set());
      }
      filters.get(key)?.add(value);
    };

    for (const product of products) {
      for (const variant of product.variants ?? []) {
        for (const attributeValue of variant.attributeValues ?? []) {
          const key = attributeValue.attribute?.code;
          const value = attributeValue.option?.value ?? attributeValue.rawValue;
          if (key) {
            pushValue(key, value);
          }
        }
      }
    }

    const result: ProductFilterMap = {};
    for (const [key, values] of filters.entries()) {
      result[key] = Array.from(values);
    }

    if (categoryId) {
      const categoryAttributes = await this.categoryProductAttributeRepository.find({
        where: { category: { id: categoryId }, filterable: true },
        relations: ['attribute', 'attribute.options'],
        order: {
          sortOrder: 'ASC',
          id: 'ASC',
        },
      });

      for (const categoryAttribute of categoryAttributes) {
        const key = categoryAttribute.attribute?.code;
        if (!key) {
          continue;
        }

        if (!result[key]) {
          result[key] = [];
        }

        for (const option of categoryAttribute.attribute?.options ?? []) {
          if (!option.isActive) {
            continue;
          }
          if (!result[key].includes(option.value)) {
            result[key].push(option.value);
          }
        }
      }
    }

    return {
      categoryId: categoryId ?? null,
      filters: result,
    };
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: [
        'category',
        'variants',
        'variants.attributeValues',
        'variants.attributeValues.attribute',
        'variants.attributeValues.option',
      ],
    });
    if (!product) {
      throw new NotFoundException('Product does not exist!');
    }
    this.normalizeProductImages(product);
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    const { variants, category, ...productData } = updateProductDto;

    Object.assign(product, productData);
    if (category !== undefined) {
      product.category = await this.resolveCategoryOrThrow(category);
    }
    if (variants !== undefined) {
      product.variants = await this.buildVariants(variants);
    }

    const savedProduct = await this.productRepository.save(product);
    this.normalizeProductImages(savedProduct);
    return savedProduct;
  }

  async updateImage(id: number, imageUrl: string) {
    const product = await this.findOne(id);
    product.image = imageUrl;
    const savedProduct = await this.productRepository.save(product);
    this.normalizeProductImages(savedProduct);
    return savedProduct;
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.productRepository.delete(id);
  }

  private async buildVariants(
    variants: CreateProductVariantDto[],
  ): Promise<ProductVariant[]> {
    const builtVariants: ProductVariant[] = [];

    for (const variantDto of variants) {
      const variant = new ProductVariant();
      variant.sku = variantDto.sku;
      variant.price = variantDto.price;
      variant.quantity = variantDto.quantity ?? 0;
      variant.image = variantDto.image;
      variant.attributeValues = await this.buildVariantAttributeValues(
        variantDto.attributeValues ?? [],
      );
      builtVariants.push(variant);
    }

    return builtVariants;
  }

  private async buildVariantAttributeValues(
    attributeValues: CreateProductVariantAttributeValueDto[],
  ): Promise<ProductVariantAttributeValue[]> {
    const values: ProductVariantAttributeValue[] = [];

    for (const attributeValueDto of attributeValues) {
      if (!attributeValueDto.optionId && !attributeValueDto.rawValue) {
        throw new BadRequestException(
          'Each variant attribute value must contain optionId or rawValue',
        );
      }

      const attribute = await this.productAttributeRepository.findOne({
        where: { id: attributeValueDto.attributeId },
      });
      if (!attribute) {
        throw new NotFoundException(
          `Attribute ${attributeValueDto.attributeId} does not exist`,
        );
      }

      let option: ProductAttributeOption | null = null;
      if (attributeValueDto.optionId) {
        option = await this.productAttributeOptionRepository.findOne({
          where: { id: attributeValueDto.optionId },
          relations: ['attribute'],
        });

        if (!option) {
          throw new NotFoundException(
            `Attribute option ${attributeValueDto.optionId} does not exist`,
          );
        }

        if (option.attribute?.id !== attribute.id) {
          throw new BadRequestException(
            `Attribute option ${attributeValueDto.optionId} does not belong to attribute ${attribute.id}`,
          );
        }
      }

      const value = new ProductVariantAttributeValue();
      value.attribute = attribute;
      value.option = option;
      value.rawValue = attributeValueDto.rawValue ?? null;
      values.push(value);
    }

    return values;
  }

  private async resolveCategoryOrThrow(
    categoryRef: { id?: number } | null | undefined,
  ): Promise<Category | undefined> {
    if (categoryRef == null || categoryRef.id == null) {
      return undefined;
    }

    const category = await this.categoryRepository.findOne({
      where: { id: categoryRef.id },
    });
    if (!category) {
      throw new NotFoundException(`Category ${categoryRef.id} does not exist`);
    }
    return category;
  }

  private normalizeProductImages(product: Product) {
    if (!product) {
      return;
    }

    const resolvedProductImage = this.mediaService.resolvePublicUrl(product.image);
    if (resolvedProductImage) {
      product.image = resolvedProductImage;
    }

    if (product.category) {
      const resolvedCategoryImage = this.mediaService.resolvePublicUrl(
        product.category.image,
      );
      if (resolvedCategoryImage) {
        product.category.image = resolvedCategoryImage;
      }
    }

    if (product.variants?.length) {
      product.variants.forEach((variant) => {
        const resolvedVariantImage = this.mediaService.resolvePublicUrl(
          variant.image,
        );
        if (resolvedVariantImage) {
          variant.image = resolvedVariantImage;
        }
      });
    }
  }
}
