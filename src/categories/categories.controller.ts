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
  } from '@nestjs/common';
  
  import CreateCategoryDto from './dto/createCategory.dto';
  
  import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import CategoriesService  from './categories.service';
  
  
  @Controller('categories')
  @UseInterceptors(ClassSerializerInterceptor)
  export default class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}
  
    // @Get()
    // getAllCategories() {
    //   return this.categoriesService.getAllCategories();
    // }
  
    @Get(':id')
    getCategoryById(@Param('id') id: string) {
      return this.categoriesService.findOne(Number(id));
    }

    @Post()
//   @UseGuards(JwtAuthenticationGuard)
  async createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.create(category);
  }
  
  
//     @Patch(':id')
//     async updateCategory(
//       @Param() { id }: FindOneParams,
//       @Body() category: UpdateCategoryDto,
//     ) {
//       return this.categoriesService.updateCategory(Number(id), category);
//     }
  
  }