import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RedisModule } from '@app/common/redis/redis.module';
import { UserModule } from 'apps/user/src/user.module';
import { USER_SERVICE } from '@app/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
@Module({
  imports: [
    RedisModule,
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret', // Replace with your own secret key
    }),

    ClientsModule.registerAsync([
      {
        name: USER_SERVICE,
        useFactory: () => ({
          transport: Transport.TCP,
          options: {
            host: 'localhost',
            port: 4001,
          },
        }),
      },
    ]),
    JwtModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
