import { IsNotEmpty, IsNumber, IsString, IsDate, IsOptional } from 'class-validator';
import { Brand } from 'src/brand/brand.entity';


export default class UpdateProductDto {
    @IsNumber()
    id: number;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;

    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @IsNumber({}, { each: true }) // Mỗi phần tử trong mảng là một số
    brand: Brand;

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}