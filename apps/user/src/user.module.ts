import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DatabaseModule, USER_SERVICE } from '@app/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    DatabaseModule,
    ClientsModule.register([
      {
        name: USER_SERVICE,
        transport: Transport.TCP, // Change transport to TCP
        options: {
          host: 'localhost', // Specify the host of your microservice
          port: 4001, // Specify the port of your microservice
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [TypeOrmModule.forFeature([User])],
})
export class UserModule {}
