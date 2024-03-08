import { Body, Controller, NotFoundException, Param, Put } from '@nestjs/common';
import UpdateUserDto from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

  @Put(':id')
  async updateUser(@Param('id') userId: number, @Body() updateData: UpdateUserDto) {
    const updatedUser = await this.usersService.update(userId, updateData);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return updatedUser;
  }
}
