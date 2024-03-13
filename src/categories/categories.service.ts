import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import { Brand } from 'src/brand/brand.entity';

@Injectable()
export default class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Brand)
        private readonly brandRepository: Repository<Brand>,
      ) {}
    
      async findAll(): Promise<Category[]> {
        // return await this.categoryRepository.find();
        const product = await this.categoryRepository.createQueryBuilder('category')
          .leftJoinAndSelect('category.brands', 'brands')
          .leftJoinAndSelect('brands.products', 'products')
          .getMany();
    
        if (product) {
          return product;
        }
    
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }

      async findOne(id: number): Promise<Category> {
        const product = await this.categoryRepository.createQueryBuilder('category')
          .leftJoinAndSelect('category.brands', 'brands')
          .leftJoinAndSelect('brands.products', 'products')
          .where('category.id = :id', { id })
          .getOne();
    
        if (product) {
          return product;
        }
    
        throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
      }
    
      async create(category: CreateCategoryDto) {
        const newCategory = await this.categoryRepository.create(category);
        await this.categoryRepository.save(newCategory);
        return newCategory;
      }
    
      async update(id: number, category: UpdateCategoryDto) {
        const categotycheck = await this.categoryRepository.findOne({where: {id}})

        if (!categotycheck) {
          throw new NotFoundException(`category with id ${id} not found`);
        }

        categotycheck.name = category.name;
        return await this.categoryRepository.save(categotycheck);
    }

    async deleteCategory(id: number) {
      const category = await this.categoryRepository.findOne({where: {id}})
      console.log(1,category);
      const brandCategory = await this.brandRepository.find({where: {category: category}})
      console.log(2,brandCategory);
      for( const detail of brandCategory){
        console.log(3,detail);
        detail.category = null;
        await this.brandRepository.save(detail);
      }
      await this.categoryRepository.remove(category);

      
      
    }
  }
