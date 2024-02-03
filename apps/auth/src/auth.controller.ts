import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject('USER_SERVICE') private readonly userServiceClient: ClientProxy,
  ) {}

  @Get()
  getHello(): string {
    return this.authService.getHello();
  }

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
}
