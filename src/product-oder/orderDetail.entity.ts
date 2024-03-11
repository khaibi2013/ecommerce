import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './productOder.entity';
import { Product } from '../products/product.entity'; // Đường dẫn tới entity của Product

@Entity()
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderDetails)
  order: Order;

  @ManyToOne(() => Product, product => product.orderDetails)
  product: Product;

  @Column()
  quantity: number;
    newDetail: { id: any; };

  @Column({nullable: true})
  price: number;

  @Column({nullable: true})
  status: number;
}
