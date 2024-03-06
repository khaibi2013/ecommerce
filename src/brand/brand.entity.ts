// brand.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Product } from '../products/product.entity';
import { Category } from '../categories/categories.entity';

@Entity()
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Product, product => product.brand)
  products: Product[];

  @ManyToOne(() => Category, category => category.brands) // Định nghĩa mối quan hệ Many-to-One với Category
  category: Category;
}
