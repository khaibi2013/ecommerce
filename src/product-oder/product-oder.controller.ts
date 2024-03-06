// order.controller.ts
import { Controller, Post, Get, Param, Body, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { ProductOderService } from './product-oder.service';
import JwtAuthenticationGuard from 'src/authentication/jwt-authentication.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: ProductOderService) {}
  
  @UseGuards(JwtAuthenticationGuard)
  @Post()
  createOrder( @Body() orderData: any, @Req() request: RequestWithUser) {
    const userID = request.user.id;
    return this.orderService.createOrder(userID, orderData);
  }

//   @Get()
//   getAllOrders() {
//     return this.orderService.getAllOrders();
//   }

//   @Get(':id')
//   getOrderById(@Param('id') id: number) {
//     return this.orderService.getOrderById(id);
//   }

//   @Put(':id')
//   updateOrder(@Param('id') id: number, @Body() orderData: any) {
//     return this.orderService.updateOrder(id, orderData);
//   }

//   @Delete(':id')
//   deleteOrder(@Param('id') id: number) {
//     return this.orderService.deleteOrder(id);
//   }
}
