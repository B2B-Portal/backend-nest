import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductAttributeService } from './product-attribute.service';
import { CreateProductAttributeDto } from './dto/create-product-attribute.dto';
import { CreateProductAttributeOptionDto } from './dto/create-product-attribute-option.dto';
import { SetCategoryProductAttributesDto } from './dto/set-category-product-attributes.dto';

@ApiTags('Product Attribute')
@Controller('product-attribute')
export class ProductAttributeController {
  constructor(
    private readonly productAttributeService: ProductAttributeService,
  ) {}

  @Post()
  createAttribute(@Body() createProductAttributeDto: CreateProductAttributeDto) {
    return this.productAttributeService.createAttribute(createProductAttributeDto);
  }

  @Get()
  findAllAttributes() {
    return this.productAttributeService.findAllAttributes();
  }

  @Post(':attributeId/options')
  addOption(
    @Param('attributeId') attributeId: string,
    @Body() createProductAttributeOptionDto: CreateProductAttributeOptionDto,
  ) {
    return this.productAttributeService.addOption(
      +attributeId,
      createProductAttributeOptionDto,
    );
  }

  @Get(':attributeId/options')
  getAttributeOptions(@Param('attributeId') attributeId: string) {
    return this.productAttributeService.getAttributeOptions(+attributeId);
  }

  @Put('category/:categoryId')
  setCategoryAttributes(
    @Param('categoryId') categoryId: string,
    @Body() setCategoryProductAttributesDto: SetCategoryProductAttributesDto,
  ) {
    return this.productAttributeService.setCategoryAttributes(
      +categoryId,
      setCategoryProductAttributesDto,
    );
  }

  @Get('category/:categoryId')
  getCategoryAttributes(@Param('categoryId') categoryId: string) {
    return this.productAttributeService.getCategoryAttributes(+categoryId);
  }
}
