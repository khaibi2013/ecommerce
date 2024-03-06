import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import CreateBrandDto from './dto/CreateBrand.dto'
import { Category } from 'src/categories/categories.entity';


@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async findAll(): Promise<Brand[]> {
    return await this.brandRepository.find();
  }

  async findOne(id: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({ where: { id },relations: ['category'] });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }
    return brand;
  }

  async create(brand: CreateBrandDto) {
    const newbrand = await this.brandRepository.create(brand);
    await this.brandRepository.save(newbrand);
    return newbrand;
  }

// async create(name: string, categoryId: number): Promise<Brand> {
//     const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
//     if (!category) {
//       throw new NotFoundException(`Category with ID ${categoryId} not found`);
//     }

//     const brand = this.brandRepository.create({ name, category });
//     await this.brandRepository.save(brand);

//     // Thêm brand vào mảng brands của category
//     if (!category.brands) {
//       category.brands = [];
//     }
//     category.brands.push(brand);
//     await this.categoryRepository.save(category);

//     return brand;
//   }

  async update(id: number, newName: string): Promise<Brand> {
    const brand = await this.findOne(id);
    brand.name = newName;
    return await this.brandRepository.save(brand);
  }

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    await this.brandRepository.remove(brand);
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