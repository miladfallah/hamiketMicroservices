import {
  Body,
  Controller,
  Inject,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Redis } from 'ioredis'; // Assuming you're using ioredis
import { CreateUserDto } from 'apps/user/src/dtos/create-user.dto';
@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Post()
  async checkUserPasswordStatus(
    @Body(new ValidationPipe()) input: { mobileNumber: string },
    @Res() res: Response,
  ): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.userServiceClient.send({ cmd: 'checkUserPasswordStatus' }, input),
      );

      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  @Post('doAuth')
  async doAuth(
    @Body() createUserDto: CreateUserDto,
    @Body('verifyCode') verifyCode: string,
  ): Promise<any> {
    try {
      const result = await this.authService.doAuth(createUserDto, verifyCode);
      return result;
    } catch (error) {
      return error.getResponse();
    }
  }
}
