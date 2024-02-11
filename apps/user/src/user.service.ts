import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { MessagePattern } from '@nestjs/microservices';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;

    // Check if username is already taken
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }
    const user = this.userRepository.create(createUserDto);
    // createUserDto.picture = '';
    this.userRepository.save(user);
    return user;
  }

  async findUserByMobileNumber(
    mobileNumber: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOneBy({ mobileNumber });
  }

  @MessagePattern({ cmd: 'getUserInfoByMobileNum' })
  async getUserInfoByMobileNum(
    mobileNumber: string,
  ): Promise<User | undefined> {
    try {
      const userRecord = await this.userRepository.findOneBy({ mobileNumber });

      if (!userRecord) {
        throw new HttpException(
          { state: false, errorCode: -1, message: 'User not found' },
          HttpStatus.NOT_FOUND,
        );
      }

      return userRecord;
    } catch (error) {
      console.error('Error in getUserInfoByMobileNum:', error);

      throw new HttpException(
        { state: false, errorCode: -4, message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
