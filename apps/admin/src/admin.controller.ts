import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Patch,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dtos/create-admin.dto';
import { UpdateAdminDto } from './dtos/update-admin.dto';
import { AppError } from '@app/common';
import { JwtAuthGuard } from 'apps/auth/src/jwt-auth.guard';
import { Roles } from '@app/common/decorators/roles.decorator';

@Controller('v1/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  // @UseGuards(JwtAuthGuard)
  async register(@Body() createAdminDto: CreateAdminDto): Promise<any> {
    try {
      const admin = await this.adminService.create(createAdminDto);

      return { message: 'admin registered successfully', admin };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        console.log(error);

        throw new HttpException(
          { message: 'Internal server error', error: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }

  @Post('login')
  async login(@Body() input: any): Promise<any> {
    const { password, userName } = input;
    try {
      const admin = await this.adminService.login(password, userName);
      return { message: 'admin logged in successful', admin };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      } else {
        throw new AppError(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Patch('edit')
  @Roles('admin')
  @UseGuards(JwtAuthGuard)
  async edit(
    @Request() req,
    @Body() updateAdminDto: UpdateAdminDto,
  ): Promise<any> {
    try {
      const authenticatedUser = req.admin;

      const updatedAdmin = await this.adminService.update(
        authenticatedUser,
        updateAdminDto,
      );
      return { message: 'admin updated successfully', updatedAdmin };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          { message: 'Internal server error', error: error.message },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
