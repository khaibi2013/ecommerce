import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from './brand.entity';
import CreateBrandDto from './dto/CreateBrand.dto'
import { Category } from 'src/categories/categories.entity';
import { UpdateBrandDto } from './dto/UpdateBrand.dto';
import { Product } from 'src/products/product.entity';


@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
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

async updateBrand(id: number, updateData: UpdateBrandDto): Promise<Brand> {
  const brand = await this.brandRepository.findOne({ where: { id } });
  if (!brand) {
    throw new NotFoundException('Brand not found');
  }

  if (updateData.name) {
    brand.name = updateData.name;
  }
  if (updateData.category) {
    brand.category = updateData.category;
  }

  return await this.brandRepository.save(brand);
}

  async remove(id: number): Promise<void> {
    const brand = await this.findOne(id);
    const brandProduct = await this.productRepository.find({where: {brand: brand}})
    for (const detail of brandProduct) {
      detail.brand = null;
       await this.productRepository.save(detail);
      console.log(1,detail);
    }
    await this.brandRepository.remove(brand);
  }
}