import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../auth/src/jwt-auth.guard';
import { User } from 'apps/user/src/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  ADMIN_SERVICE,
  DatabaseModule,
  JwTokenService,
  PasswordService,
} from '@app/common';
import { RedisModule } from '@app/common/redis/redis.module';

@Module({
  imports: [
    DatabaseModule,
    RedisModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
    }),
    TypeOrmModule.forFeature([Admin, User]),
    ClientsModule.register([
      {
        name: ADMIN_SERVICE,
        transport: Transport.TCP,
        options: {
          host: process.env.ADMIN_MICROSERVICE_HOST || 'localhost',
          port: parseInt(process.env.ADMIN_MICROSERVICE_PORT, 10) || 4002,
        },
      },
    ]),
  ],
  controllers: [AdminController],
  providers: [
    AdminService,
    PasswordService,
    JwTokenService,
    {
      provide: 'JwtAuthGuard', // Use string token
      useFactory: () => forwardRef(() => JwtAuthGuard), // Resolve dynamically using forwardRef
    },
  ],
  exports: [TypeOrmModule.forFeature([Admin]), AdminService],
})
export class AdminModule {}
