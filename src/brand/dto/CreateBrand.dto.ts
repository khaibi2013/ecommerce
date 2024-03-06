import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBrandDto {
  
  name: string;

  categoryId: number;
}

export default CreateBrandDto;