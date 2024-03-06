import { Brand } from 'src/brand/brand.entity';
import { OrderDetail } from 'src/product-oder/orderDetail.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Brand, brand => brand.products)
  brand: Brand;

  @OneToMany(() => OrderDetail, orderDetails => orderDetails.product)
  orderDetails: OrderDetail;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  
}

