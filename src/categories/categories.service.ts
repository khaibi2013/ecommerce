import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Category } from './categories.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreateCategoryDto from './dto/CreateCategory.dto';

@Injectable()
export default class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
      ) {}
    
      async findAll(): Promise<Category[]> {
        return await this.categoryRepository.find();
      }
    
    //   async findOne(id: number): Promise<Category> {
    //     const brand = await this.categoryRepository.findOne({ where: { id }, relations: ['brands'] });
    //     if (!brand) {
    //       throw new NotFoundException(`category with ID ${id} not found`);
    //     }
    //     return brand;
    //   }

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


    
      async update(id: number, newName: string): Promise<Category> {
        const brand = await this.findOne(id);
        brand.name = newName;
        return await this.categoryRepository.save(brand);
      }
    
      async remove(id: number): Promise<void> {
        const brand = await this.findOne(id);
        await this.categoryRepository.remove(brand);
      }
    
    //   async addBrandToProduct(brandId: number, productId: number): Promise<Product> {
    //     const brand = await this.findOne(brandId);
    //     const product = await this.productRepository.findOne({ where: { id: productId } });
        
    //     if (!product) {
    //       throw new NotFoundException(`Product with ID ${productId} not found`);
    //     }
    //     product.brand = brand as Brand;
    //     return await this.productRepository.save(product);
    //   }
    }
