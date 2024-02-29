import {
  Body,
  // ConflictException,
  Controller,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
// import { CreateUserDto } from './dtos/create-user.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
// import { ActiveStatus, HideHelpStatus, UserType } from '@app/common/Enums';

@Controller('v1/user')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // async create(
  //   @Body(new ValidationPipe()) createUserDto: CreateUserDto,
  // ): Promise<any> {
  //   try {
  //     const nowDate: number = new Date().getTime() / 1000;

  //     const user = await this.userService.create({
  //       ...createUserDto,
  //       // Set default values
  //       picture: '',
  //       lastSeen: -1,
  //       active: ActiveStatus.INACTIVE,
  //       userType: UserType.Customer,
  //       hideHelp: HideHelpStatus.True,
  //       createdAt: nowDate,
  //       updatedAt: nowDate,
  //     });

  //     return {
  //       state: true,
  //       user,
  //     };
  //   } catch (error) {
  //     if (error instanceof ConflictException) {
  //       // Handle conflict (username already taken) error
  //       throw new HttpException(
  //         { state: false, message: 'Username is already taken' },
  //         HttpStatus.CONFLICT,
  //       );
  //     } else {
  //       // Handle other errors
  //       throw new HttpException(
  //         { message: 'Internal Server Error' },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     }
  //   }
  // }

  @Post('checkUserPasswordStatus')
  async checkUserPasswordStatus(
    @Body(new ValidationPipe()) input: any,
  ): Promise<any> {
    try {
      const userCheck = await this.userService.checkUserPasswordStatus(input);
      return userCheck;
    } catch (error) {
      throw new HttpException(
        { message: 'Internal Server Error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @MessagePattern('get_userinfo_by_mobile_number')
  async getUserInfoByMobileNumber(@Payload() data: string) {
    try {
      return this.userService.getUserInfoByMobileNumber(data);
    } catch (error) {
      console.error(error);
      throw new Error('Error processing message');
    }
  }

  @MessagePattern('register_by_mobile_number')
  async registerByMobileNumber(@Payload() data: string) {
    return this.userService.registerByMobileNumber(data);
  }
}
