import  Role  from 'src/database/role.enum';
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import Address from './address.entity';
import { Order } from 'src/product-oder/productOder.entity';
 
@Entity()
class User {
  @PrimaryGeneratedColumn()
  public id?: number;
 
  @Column({ unique: true })
  public email: string;
 
  @Column()
  public name: string;
 
  @Column()
  public password: string;

  @Column({
    type: 'enum',
    enum: Role,
    array: true,
    default: [Role.User]
  })
  public roles: Role[]

  
@OneToOne(() => Address, {
    eager: true,
    cascade: true
  })
  @JoinColumn()
  public address: Address;

  @OneToMany(() => Order, order => order.user)
  orders: Order[];
}
 
export default User;