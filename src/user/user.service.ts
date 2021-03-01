import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CreateUserRequestDto } from './dto/createUserRequestDto';
import { UserMapper } from './mapper/userMapper';
import { GetUserResponseDto } from './dto/getUserResponseDto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly UserRepository: Repository<UserEntity>,
  ) {}

  async createUser(data: CreateUserRequestDto): Promise<UserEntity> {
    const user = new UserEntity();
    user.firstName = data.firstName;
    user.lastName = data.lastName;
    user.password = data.password;
    user.email = data.email;

    await this.UserRepository.save(user);

    return user;
  }

  async findUser(email: string): Promise<UserEntity> {
    return await this.UserRepository.findOne({ email });
  }

  async confirmUser(userId: string): Promise<void> {
    await this.UserRepository.update({ id: userId }, { confirmed: true });
  }

  async getUsers(): Promise<GetUserResponseDto[]> {
    const users = await this.UserRepository.find();
    if (!users) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return users.map(UserMapper.fromEntity);
  }

  async getUser(id: string): Promise<GetUserResponseDto> {
    const user = await this.UserRepository.findOne({ id });
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return UserMapper.fromEntity(user);
  }
}
