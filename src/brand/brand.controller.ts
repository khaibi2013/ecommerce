import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BrandService } from './brand.service';
import CreateBrandDto from './dto/CreateBrand.dto';
import { UpdateBrandDto } from './dto/UpdateBrand.dto';
import RoleGuard from 'src/authentication/role.guard';

import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import Role from 'src/database/role.enum';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}
    
    @UseGuards(RoleGuard(Role.Admin))
    @UseGuards(JwtAuthenticationGuard)
    @Post()
    async createBrand(@Body() brand: CreateBrandDto) {
        return this.brandService.create(brand);
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.brandService.findOne(Number(id));
    }

    @Put(':id')
    async updateBrand(@Param('id') id: string, @Body() brand: UpdateBrandDto) {
        return this.brandService.updateBrand(Number(id), brand);
    }
    @Delete(':id')
    async deleteBrand(@Param('id') id: string) {
        await this.brandService.remove(Number(id));
    }
}
