import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';
import { MediaService } from '../media/media.service';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: TreeRepository<Category>,
    private readonly mediaService: MediaService,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category).then((savedCategory) => {
      this.normalizeCategoryImages(savedCategory);
      return savedCategory;
    });
  }

  async findAll() {
    const categories = await this.categoryRepository.findTrees();
    categories.forEach((category) => this.normalizeCategoryImages(category));
    return categories;
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Category does not exist!');
    }

    // Получаем категорию с дочерними элементами (потомками)
    const categoryWithDescendants =
      await this.categoryRepository.findDescendantsTree(category);

    // Если у категории есть родитель, загружаем его дерево предков
    if (category.parent) {
      const parentWithAncestors =
        await this.categoryRepository.findAncestorsTree(category.parent);
      // Добавляем родительскую категорию с её предками к результату
      categoryWithDescendants.parent = parentWithAncestors;
    }

    this.normalizeCategoryImages(categoryWithDescendants);
    return categoryWithDescendants;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async updateImage(id: number, imageUrl: string) {
    const category = await this.findOne(id);
    category.image = imageUrl;
    const savedCategory = await this.categoryRepository.save(category);
    this.normalizeCategoryImages(savedCategory);
    return savedCategory;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.categoryRepository.delete(id);
  }

  private normalizeCategoryImages(category: Category, visited = new Set<number>()) {
    if (!category || visited.has(category.id)) {
      return;
    }

    visited.add(category.id);
    const resolvedImage = this.mediaService.resolvePublicUrl(category.image);
    if (resolvedImage) {
      category.image = resolvedImage;
    }

    if (category.parent) {
      this.normalizeCategoryImages(category.parent, visited);
    }

    if (category.children?.length) {
      category.children.forEach((child) =>
        this.normalizeCategoryImages(child, visited),
      );
    }
  }
}
