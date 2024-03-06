import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
// import { ProductsModule } from '../products/products.module';
import { BrandController } from './brand.controller';
import { CategoriesModule } from 'src/categories/categories.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Brand]),
    
    
],
  providers: [BrandService],
  exports: [BrandService],
  controllers: [BrandController],
})
export class BrandModule {}