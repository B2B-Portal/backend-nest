import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { TreeRepository } from 'typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: TreeRepository<Category>,
  ) {}

  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.findTrees();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parent'],
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

    return categoryWithDescendants;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return await this.categoryRepository.update(id, updateCategoryDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.categoryRepository.delete(id);
  }
}
