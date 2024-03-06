import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './productOder.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import User from 'src/users/user.entity';
import { OrderDetail } from './orderDetail.entity';
import { request } from 'http';
import { Product } from 'src/products/product.entity';

@Injectable()
export class ProductOderService {
    constructor(
        @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailRepository: Repository<OrderDetail>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
      ) {}

    async createOrder(userId: number, orderData: CreateOrderDto){
        // Lấy thông tin người dùng từ cơ sở dữ liệu
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }
        let savedOrder: Order;
        // Kiểm tra xem người dùng đã tạo đơn hàng trước đó chưa
        const existingOrder = await this.orderRepository.findOne({ where: { user: user } });
    
        if (existingOrder) {
            // Nếu đã tạo đơn hàng trước đó, cập nhật thông tin đơn hàng
            existingOrder.street = user.address.street;
            existingOrder.city = user.address.city;
            existingOrder.country = user.address.country;
    
            // Lưu thông tin đơn hàng đã cập nhật
            savedOrder = await this.orderRepository.save(existingOrder);
        } else {
            // Nếu chưa tạo đơn hàng trước đó, tạo mới đơn hàng
            const newOrder = new Order();
            newOrder.user = user;
            newOrder.street = user.address.street;
            newOrder.city = user.address.city;
            newOrder.country = user.address.country;
            // Lưu đơn hàng mới vào cơ sở dữ liệu
            savedOrder = await this.orderRepository.save(newOrder);
        }
        // Tạo mảng các chi tiết đơn hàng
        for (const detail of orderData.orderDetails) {
            let orderDetail = await this.orderDetailRepository.findOne({
                where: {product: { id: detail.productId } }
            });
            if (orderDetail) {
                // Nếu orderDetail đã tồn tại, cập nhật số lượng
                orderDetail.quantity += detail.quantity;
                await this.orderDetailRepository.save(orderDetail);
            } else {
                // Nếu orderDetail chưa tồn tại, tạo mới và lưu
                const product = await this.productRepository.findOne({ where: { id: detail.productId } });
                if (!product) {
                    throw new NotFoundException(`Product with ID ${detail.productId} not found`);
                }
                orderDetail = new OrderDetail();
                orderDetail.order = savedOrder;
                orderDetail.product = product;
                orderDetail.quantity = detail.quantity;
                await this.orderDetailRepository.save(orderDetail);
            }
        }
        // Trả về thông tin đơn hàng 
        return savedOrder;
    }
}
