import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseModule, USER_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt'; // Import JwtModule
import { JwtAuthGuard } from '../../auth/src/jwt-auth.guard'; // Import JwtAuthGuard

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
    }),
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP,
        options: {
          host: 'localhost',
          port: 4001,
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    {
      provide: JwtAuthGuard, // Directly provide JwtAuthGuard
      useClass: JwtAuthGuard,
    },
  ],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
