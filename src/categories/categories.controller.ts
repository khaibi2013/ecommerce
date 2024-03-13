import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    UseGuards,
    UseInterceptors,
    ClassSerializerInterceptor,
    Post,
    Put,
  } from '@nestjs/common';
  
  import CreateCategoryDto from './dto/createCategory.dto';
  
  import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import CategoriesService  from './categories.service';
import UpdateCategoryDto from './dto/updateCategory.dto';
  
  
  @Controller('categories')
  @UseInterceptors(ClassSerializerInterceptor)
  export default class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    @Get()
    getAllCategories() {
      return this.categoriesService.findAll();
    }
  
    @Get(':id')
    getCategoryById(@Param('id') id: string) {
      return this.categoriesService.findOne(Number(id));
    }

    @Post()
//   @UseGuards(JwtAuthenticationGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.create(category);
  }

  
  
  @Put(':id')
  async updateBrand(@Param('id') id: string, @Body() category: UpdateCategoryDto) {
      return this.categoriesService.update(Number(id), category);
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
      this.categoriesService.deleteCategory(Number(id));
  }
  
  }