import { IsObject, IsOptional, IsString, ValidateNested } from "class-validator";
import AddressDto from "./address.dto";
import { Type } from "class-transformer";

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    password?: string;

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => AddressDto)
    address?: AddressDto;
}

export default UpdateUserDto;