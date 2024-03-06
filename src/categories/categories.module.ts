import { Module } from '@nestjs/common';


import { Category } from './categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import  CategoriesService  from './categories.service';
import CategoriesController from './categories.controller';
import { BrandModule } from 'src/brand/brand.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers:[CategoriesController],
  providers: [CategoriesService],
  exports:[CategoriesService]
})
export class CategoriesModule {}