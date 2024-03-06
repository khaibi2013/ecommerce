import { Module } from '@nestjs/common';
import { OrderController } from './product-oder.controller';
import { ProductOderService } from './product-oder.service';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './productOder.entity';
import { OrderDetail } from './orderDetail.entity';
import User from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Module({
    imports: [ProductsModule,UsersModule,TypeOrmModule.forFeature([Order,OrderDetail,User,Product]),],
    providers:[ProductOderService],
    controllers: [OrderController],
    exports:[ProductOderService]
})
export class ProductOderModule {}
