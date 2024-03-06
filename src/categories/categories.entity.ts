import { Brand } from "src/brand/brand.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  
  @OneToMany(() => Brand, brand => brand.category) // Định nghĩa mối quan hệ One-to-Many với Brand
  brands: Brand[];
}
