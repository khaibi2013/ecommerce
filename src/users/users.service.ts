import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import Address from './address.entity';
import AddressDto from './dto/address.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) { }

  async getById(id: number) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
  }

  async getByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user) {
      return user;
    }
    throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
  }

  async create(userData: CreateUserDto) {
    const newUser = await this.usersRepository.create(userData);
    await this.usersRepository.save(newUser);
    return newUser;
  }

  private convertAddressDtoToAddress(addressDto: AddressDto): Address {
    const address = new Address();
    address.street = addressDto.street;
    address.city = addressDto.city;
    address.country = addressDto.country;
    return address;
  }

  async update(userId: number,updateData: UpdateUserDto) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (updateData.password) {
      // Nếu có mật khẩu mới, mã hóa nó trước khi cập nhật
      user.password = await bcrypt.hash(updateData.password, 10);
    }
    if (updateData.name) {
      user.name = updateData.name;
    }
    if (updateData.address) {
      user.address = this.convertAddressDtoToAddress(updateData.address);
    }

    // Lưu thông tin người dùng đã cập nhật vào cơ sở dữ liệu
    return await this.usersRepository.save(user);
  }

  }

