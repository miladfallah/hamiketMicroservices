import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { MessagePattern } from '@nestjs/microservices';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @Get()
  getHello(): string {
    return this.userService.getHello();
  }

  @Post()
  create(
    @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  ): Promise<User> {
    return this.userService.create(createUserDto);
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
