import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from '@app/common/redis/redis.module';
import { UserModule } from 'apps/user/src/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    RedisModule,
    UserModule, // Import the UserModule or the module containing UserRepository here
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'user_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
