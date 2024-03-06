import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { Product } from "src/products/product.entity";
import User from "src/users/user.entity";
import { OrderDetailDto } from "./OrderDetail.dto";

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderDetailDto)
    orderDetails: OrderDetailDto[];
  
}
