import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
// import Product from './product.interface';
import UpdateProductDto from './dto/updateProduct.dto';
import CreateProductDto from './dto/createProduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { MoreThan, Repository } from 'typeorm';
import { Brand } from 'src/brand/brand.entity';
import User from 'src/users/user.entity';
import { OrderDetail } from 'src/product-oder/orderDetail.entity';


@Injectable()
export default class ProductsService {
    constructor(
        @InjectRepository(Product)
        private productsRepository: Repository<Product>,
        @InjectRepository(OrderDetail)
        private orderDetailRepository: Repository<OrderDetail>
      ) {}
    

    getAll() {
        return this.productsRepository.find({where: {quantity: MoreThan(0)}});
    }


    async getById(id: number, user: User) {
      console.log(user.id);
      
      const product = await this.productsRepository.createQueryBuilder('product')
        .leftJoinAndSelect('product.brand', 'brand')
        .leftJoinAndSelect('brand.category', 'category')
        .where('product.id = :id', { id })
        .getOne();
  
      if (product) {
        return product;
      }
  
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }

    async updateProduct(id: number, productData: UpdateProductDto): Promise<Product> {
        // Tìm sản phẩm trong cơ sở dữ liệu
        const product = await this.productsRepository.findOne({where: { id }});
    
        // Nếu không tìm thấy sản phẩm, ném một NotFoundException
        if (!product) {
          throw new NotFoundException(`Product with id ${id} not found`);
        }
    
        // Cập nhật thông tin sản phẩm với dữ liệu mới
        product.name = productData.name;
        product.description = productData.description;
        product.price = productData.price;
        product.quantity = productData.quantity;
        product.brand = productData.brand;
        product.updatedAt = new Date();
    
        // Lưu sản phẩm đã được cập nhật vào cơ sở dữ liệu
        return await this.productsRepository.save(product);
      }

      async createProduct(product: CreateProductDto) {
        const newProduct = await this.productsRepository.create(
          product);
        await this.productsRepository.save(newProduct);
        return newProduct;
      }
      


    async deleteProduct(id: number) {
      await this.orderDetailRepository.delete({ product: { id: id } });
      await this.productsRepository.delete(id);
    }
}
