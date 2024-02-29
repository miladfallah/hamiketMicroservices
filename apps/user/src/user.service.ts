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
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username } = createUserDto;

    // Check if username is already taken
    const existingUser = await this.userRepository.findOneBy({ username });
    if (existingUser) {
      throw new ConflictException('Username is already taken');
    }
    const user = this.userRepository.create(createUserDto);
    this.userRepository.save(user);
    return user;
  }

  async findUserByMobileNumber(
    mobileNumber: string,
  ): Promise<User | undefined> {
    return this.userRepository.findOneBy({ mobileNumber });
  }

  async getUserInfoByMobileNumber(mobileNumber: string) {
    try {
      const userRecord = await this.userRepository.findOneBy({ mobileNumber });

      return userRecord;
    } catch (error) {
      console.error('Error in getUserInfoByMobileNum:', error);

      throw new HttpException(
        { state: false, errorCode: -4, message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registerByMobileNumber(mobileNumber: string) {
    try {
      const nowDate: number = new Date().getTime() / 1000;

      const user = await this.userRepository.create({
        mobileNumber,
        createdAt: nowDate,
        updatedAt: nowDate,
      });
      this.userRepository.save(user);
      return user;
    } catch (error) {
      console.error('Registration failed');
      throw new Error('Registration failed'); // Make sure the error message is consistent
    }
  }

  async checkUserPasswordStatus(input: any) {
    const mobileNumber = input.mobileNumber;
    try {
      const userExist = await this.userRepository.findOneBy({ mobileNumber });

      if (userExist) {
        if (userExist.password !== null && userExist.password !== '') {
          return { password: '2', userType: userExist.userType };
        } else {
          return { password: '1', userType: userExist.userType };
        }
      } else {
        return { password: '0', userType: '0' };
      }
    } catch (error) {
      throw new HttpException(
        { state: false, errorCode: -4, message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
