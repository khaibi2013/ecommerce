import { IsString, IsOptional, IsNumber } from 'class-validator';
import { Category } from 'src/categories/categories.entity';

export class UpdateBrandDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber({}, { each: true }) // Mỗi phần tử trong mảng là một số
  category: Category; // IDs của các danh mục mới mà thương hiệu thuộc về
}
