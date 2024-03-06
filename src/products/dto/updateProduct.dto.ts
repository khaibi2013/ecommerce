import { IsNotEmpty, IsNumber, IsString, IsDate } from 'class-validator';


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
  
    @IsNotEmpty()
    @IsDate()
    createdAt: Date;
  
    @IsNotEmpty()
    @IsDate()
    updatedAt: Date;
}