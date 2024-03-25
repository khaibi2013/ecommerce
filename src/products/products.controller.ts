import { Controller, Get, Param, Post,Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import  ProductsService  from './products.service';
import CreateProductDto from './dto/createProduct.dto';
import UpdateProductDto from './dto/updateProduct.dto';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import { BrandService } from '../brand/brand.service';
import Role from '../database/role.enum';
import RoleGuard from 'src/authentication/role.guard';
import { Request } from 'express';
import { Brand } from 'src/brand/brand.entity';
import  User  from '../users/user.entity';

import RequestWithUser from 'src/authentication/requestWithUser.interface';




@Controller('products')
export default class ProductsController {
    
    constructor(
        private readonly productsService: ProductsService,
        private readonly brandService: BrandService,
    ) {}

    // @UseGuards(RoleGuard(Role.User))
    @UseGuards(JwtAuthenticationGuard)
    @Get()
    getAllProducts() {
        return this.productsService.getAll();
    }
    @UseGuards(JwtAuthenticationGuard)
    @Get(':id')
    getProductById(@Param('id') id: string, @Req() request: RequestWithUser) {
        return this.productsService.getById(Number(id), request.user);
    }

    @Post()
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtAuthenticationGuard)
    async createProduct(@Body() product: CreateProductDto) {
        return this.productsService.createProduct(product);
    }

    @Put(':id')
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtAuthenticationGuard)
    async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto) {
        return this.productsService.updateProduct(Number(id), product);
    }

    @Delete(':id')
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtAuthenticationGuard)
    async deleteProduct(@Param('id') id: string) {
        this.productsService.deleteProduct(Number(id));
    }
}
