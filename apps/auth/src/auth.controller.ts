import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Redis } from 'ioredis'; // Assuming you're using ioredis
import { CreateUserDto } from 'apps/user/src/dtos/create-user.dto';
@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
  ) {}

  @Post('doAuth')
  async doAuth(
    @Body() createUserDto: CreateUserDto,
    @Body('verifyCode') verifyCode: string,
  ): Promise<any> {
    try {
      return await this.authService.doAuth(createUserDto, verifyCode);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          { state: false, errorCode: -4, message: 'Internal server error' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
