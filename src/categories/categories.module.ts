import { Module } from '@nestjs/common';


import { Category } from './categories.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import  CategoriesService  from './categories.service';
import CategoriesController from './categories.controller';
import { BrandModule } from 'src/brand/brand.module';
import { Brand } from 'src/brand/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,Brand])],
  controllers:[CategoriesController],
  providers: [CategoriesService],
  exports:[CategoriesService]
})
export class CategoriesModule {}