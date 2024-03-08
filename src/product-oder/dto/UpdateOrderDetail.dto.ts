import { IsArray, IsInt, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateOrderDetailDto {
  @IsInt()
  @IsNotEmpty()
  quantity: number;
}