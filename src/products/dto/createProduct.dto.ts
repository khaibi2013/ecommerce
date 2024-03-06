import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';

export default class CreateProductDto {
    

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

    @IsNotEmpty()
    @IsDate()
    createdAt: Date;

    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;

    @IsNotEmpty()
    @IsNumber()
    brandId: number; 

}