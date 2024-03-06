import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import  User  from '../users/user.entity'; // Đường dẫn tới entity của User
import { OrderDetail } from './orderDetail.entity'; // Đường dẫn tới entity của OrderDetail

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @OneToMany(() => OrderDetail, orderDetail => orderDetail.order, { cascade: true })
  orderDetails: OrderDetail[];

  @Column({ nullable: true })
  street: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
