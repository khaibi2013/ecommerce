import { Module } from '@nestjs/common';
import  ProductsService  from './products.service';
import  ProductsController  from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Product} from './product.entity';
import { BrandModule } from 'src/brand/brand.module';
import { BrandService } from 'src/brand/brand.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    BrandModule
],
  controllers: [ProductsController],
  providers: [ProductsService],
  
})
export class ProductsModule {}
