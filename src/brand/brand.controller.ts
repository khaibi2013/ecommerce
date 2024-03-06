import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BrandService } from './brand.service';
import CreateBrandDto from './dto/CreateBrand.dto';

@Controller('brand')
export class BrandController {
    constructor(private readonly brandService: BrandService) {}

    @Post()
    async createBrand(@Body() brand: CreateBrandDto) {
        return this.brandService.create(brand);
    }

    @Get(':id')
    getProductById(@Param('id') id: string) {
        return this.brandService.findOne(Number(id));
    }
}
