import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderDetailDto {
  @IsInt()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsNotEmpty()
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  price: number;

  status: string;

}