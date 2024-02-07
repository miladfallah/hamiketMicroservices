import {
  Body,
  ConflictException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { MessagePattern } from '@nestjs/microservices';
import { ActiveStatus, HideHelpStatus, UserType } from '@app/common/Enums';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post()
  async create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    try {
      const nowDate: number = new Date().getTime() / 1000;

      const user = await this.userService.create({
        ...createUserDto,
        // Set default values
        picture: '',
        lastSeen: -1,
        active: ActiveStatus.INACTIVE,
        userType: UserType.Customer,
        hideHelp: HideHelpStatus.True,
        createdAt: nowDate,
        updatedAt: nowDate,
      });

      return user;
    } catch (error) {
      if (error instanceof ConflictException) {
        // Handle conflict (username already taken) error
        throw new HttpException(
          { message: 'Username is already taken' },
          HttpStatus.CONFLICT,
        );
      } else {
        // Handle other errors
        throw new HttpException(
          { message: 'Internal Server Error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @MessagePattern({ cmd: 'checkUserPasswordStatus' })
  async checkUserPasswordStatus(data: { mobileNumber: string }): Promise<any> {
    try {
      const userExist = await this.userService.findUserByMobileNumber(
        data.mobileNumber,
      );

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
      // Handle errors appropriately
      console.error(error);
      return { password: 'error', userType: 'error' };
    }
  }
}
