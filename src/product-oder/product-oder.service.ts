import { Injectable, NotFoundException } from '@nestjs/common';
import { Order } from './productOder.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import User from 'src/users/user.entity';
import { OrderDetail } from './orderDetail.entity';
import { request } from 'http';
import { Product } from 'src/products/product.entity';
import { UpdateOrderDetailDto } from './dto/UpdateOrderDetail.dto';
import { number } from '@hapi/joi';

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
    ) { }

    async createOrder(userId: number, orderData: CreateOrderDto) {
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
            existingOrder.updatedAt = new Date();
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
            let orderDetail = await this.orderDetailRepository.createQueryBuilder("orderDetail")
                .where("orderDetail.orderId = :order", { order: savedOrder.id })
                .andWhere("orderDetail.productId = :product", { product: detail.productId })
                .andWhere("orderDetail.status = :status", { status: 1 })
                .getOne();
            console.log(orderDetail);


            if (orderDetail) {
                const product = await this.productRepository.findOne({ where: { id: detail.productId } });
                const price1 = detail.quantity * product.price
                // Nếu orderDetail đã tồn tại, cập nhật số lượng
                orderDetail.quantity += detail.quantity;
                orderDetail.price += price1;
                await this.orderDetailRepository.save(orderDetail);
            } else {
                // Nếu orderDetail chưa tồn tại, tạo mới và lưu
                const product = await this.productRepository.findOne({ where: { id: detail.productId } });
                if (!product) {
                    throw new NotFoundException(`Product with ID ${detail.productId} not found`);
                }
                const orderDetail1 = new OrderDetail();
                orderDetail1.order = savedOrder;
                orderDetail1.product = product;
                orderDetail1.quantity = detail.quantity;
                orderDetail1.status = 1;
                orderDetail1.price = product.price * detail.quantity

                await this.orderDetailRepository.save(orderDetail1);
            }
        }
        // Trả về thông tin đơn hàng 
        return savedOrder;
    }
    async getAllOrders(userId: User) {
        return this.orderDetailRepository.find({
            relations: ['order.user', 'product'],
            where: {
                order: {
                    user: {
                        id: userId.id
                    }
                },
                status: 1
            }
        });
    }

    async getOrderById(orderId: number) {
        const order = await this.orderDetailRepository.findOne({ where: { id: orderId }, relations: ['order.user', 'product'] });
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        return order;
    }

    async removeOrderById(orderId: number[], userId: User) {
        const orders = await this.orderDetailRepository
        .createQueryBuilder("orderDetail")
        .leftJoin("orderDetail.order", "order")
        .leftJoin("order.user", "user")
        .where("orderDetail.id IN (:...orderId) AND user.id = :userId", { orderId, userId: userId.id })
        .getMany();
        console.log(orders, userId);

        if (!orders) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        return this.orderDetailRepository.remove(orders);
    }

    // async payment (orderDetaiId: number) {
    //     const orderDetail = await this.orderDetailRepository.findOne({ where: { id: orderDetaiId },relations: ['product']});
    //     console.log(orderDetail);
    //     if (!orderDetail) {
    //         throw new NotFoundException(`OrderDetail with ID ${orderDetaiId} not found`);
    //     }

    //     // Kiểm tra xem sản phẩm có tồn tại không
    //     if (!orderDetail.product) {
    //         throw new NotFoundException(`Product not found for OrderDetail with ID ${orderDetaiId}`);
    //     }

    //     // Kiểm tra xem số lượng sản phẩm có đủ để thanh toán không
    //     if (orderDetail.quantity > orderDetail.product.quantity) {
    //         throw new NotFoundException(`Not enough quantity for product with ID ${orderDetail.product.id}`);
    //     }
    //     orderDetail.product.quantity -= orderDetail.quantity;
    //     await this.productRepository.save(orderDetail.product);
    //     orderDetail.status = 2;
    //     return this.orderDetailRepository.save(orderDetail);

    // }
    async payment(orderDetailIds: number[]) {
        const orderDetails = await this.orderDetailRepository
            .createQueryBuilder("orderDetail")
            .leftJoinAndSelect("orderDetail.product", "product")
            .whereInIds(orderDetailIds)
            // .where("orderDetail.id IN (:...orderDetailIds)", {orderDetailIds: orderDetailIds})
            .getMany();
        console.log(orderDetailIds);

        console.log(orderDetailIds.length);

        console.log(orderDetails);


        // Kiểm tra xem có orderDetail nào không tồn tại không
        if (orderDetails.length !== orderDetailIds.length) {
            throw new NotFoundException(`Some OrderDetails not found`);
        }

        // Kiểm tra số lượng sản phẩm có đủ để thanh toán không
        for (const orderDetail of orderDetails) {
            if (orderDetail.quantity > orderDetail.product.quantity) {
                throw new NotFoundException(`Not enough quantity for product with ID ${orderDetail.product.id}`);
            }
        }

        // Trừ số lượng sản phẩm và cập nhật trạng thái
        for (const orderDetail of orderDetails) {
            orderDetail.product.quantity -= orderDetail.quantity;
            orderDetail.status = 2;
        }

        //Lưu thay đổi vào cơ sở dữ liệu

        await this.productRepository.save(orderDetails.map(orderDetail => orderDetail.product)),
            await this.orderDetailRepository.save(orderDetails)


        return orderDetails;
    }

    async updateOrderById(orderId: number, orderData: UpdateOrderDetailDto) {
        const order = await this.orderDetailRepository.findOne({ where: { id: orderId } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${orderId} not found`);
        }
        //update thay đổi quantity
        order.quantity = orderData.quantity;
        return this.orderDetailRepository.save(order);
    }


}
