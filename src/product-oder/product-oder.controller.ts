// order.controller.ts
import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { ProductOderService } from './product-oder.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { CreateOrderDto } from './dto/CreateOrder.dto';
import { UpdateOrderDetailDto } from './dto/UpdateOrderDetail.dto';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: ProductOderService) {}
  
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  createOrder( @Body() orderData: CreateOrderDto, @Req() request: RequestWithUser) {
    const userID = request.user.id;
    return this.orderService.createOrder(userID, orderData);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Get()
  getAllOrders(@Req() request: RequestWithUser) {
    return this.orderService.getAllOrders(request.user);
  }

  @Get(':id')
  getOrderById(@Param('id') orderDetaiId: number) {
    return this.orderService.getOrderById(orderDetaiId);
  }

  @Put(':id')
  updateOrder(@Param('id') id: number, @Body() orderData: UpdateOrderDetailDto) {
    return this.orderService.updateOrderById(id, orderData);
  }

  @Post('payment')
  Payment(@Body() orderDetailIds: number[]){
    return this.orderService.payment(orderDetailIds);
  }
  @UseGuards(JwtAuthenticationGuard)
  @Delete()
  deleteOrder(@Body() orderId: number[],@Req() request: RequestWithUser) {
    return this.orderService.removeOrderById(orderId,request.user);
  }
}
