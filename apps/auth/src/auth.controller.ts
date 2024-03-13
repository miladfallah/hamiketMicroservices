import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Redis } from 'ioredis'; // Assuming you're using ioredis
import { CreateUserDto } from '../../user/src/dtos/create-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
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

  @Post('forgetPassword')
  async forget(@Body() data): Promise<any> {
    try {
      const result = await this.authService.forgetPassword(data);
      return { result, message: 'verified successfully' };
    } catch (error) {
      return { error: error.message };
    }
  }

  @Post('resetPassword')
  @UseGuards(JwtAuthGuard)
  async resetPass(@Body() input, @Request() req): Promise<any> {
    const authenticatedUser = req.user; // Assuming userInfo is attached to the request
    try {
      const result = await this.authService.resetPassword(
        input,
        authenticatedUser,
      );
      return { result };
    } catch (error) {
      return { error };
    }
  }
}
