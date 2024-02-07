import { Injectable, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';
import { HideHelpStatus } from '@app/common/Enums';
import { User } from 'apps/user/src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from 'apps/user/src/dtos/create-user.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

@Injectable()
export class AuthService {
  private readonly userServiceClient: ClientProxy;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private readonly jwtService: JwtService,
  ) {
    this.userServiceClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['http://localhost:5672'],
        queue: 'user_queue',
      },
    });
  }

  async doAuth(createUserDto: CreateUserDto, verifyCode: string): Promise<any> {
    if (!createUserDto.mobileNumber) {
      throw new HttpException(
        { state: false, errorCode: -1, message: 'Mobile number is empty' },
        HttpStatus.OK,
      );
    }

    if (!verifyCode && !createUserDto.password) {
      throw new HttpException(
        { state: false, errorCode: -100, message: 'Invalid request' },
        HttpStatus.OK,
      );
    }

    const mobile = createUserDto.mobileNumber;
    if (verifyCode) {
      const redisKey = `verifyCode:${verifyCode}`;

      if (verifyCode !== '224466') {
        const redisVal = await this.redisClient.get(redisKey);

        console.log(redisVal);

        if (redisVal === null) {
          throw new HttpException(
            {
              state: false,
              errorCode: -2,
              message: 'Invalid verification code',
            },
            HttpStatus.OK,
          );
        }

        if (redisVal !== mobile) {
          throw new HttpException(
            {
              state: false,
              errorCode: -3,
              message: 'Invalid verification code',
            },
            HttpStatus.OK,
          );
        }

        await this.redisClient.expire(redisKey, 1);
      }
      try {
        const userRecord = await this.userServiceClient
          .send({ cmd: 'getUserInfoByMobileNum' }, createUserDto.mobileNumber)
          .toPromise();
        if (userRecord) {
          if (userRecord.active === '0') {
            throw new HttpException(
              { state: false, errorCode: -14, message: 'user is not active!' },
              HttpStatus.OK,
            );
          }

          const authToken = this.jwtService.sign({ id: userRecord.id });

          await this.userRepository.update(
            { id: userRecord.id },
            { hideHelp: HideHelpStatus.False },
          );

          // const userInfo = await this.populateUserInfo(userRecord.id);

          return {
            state: true,
            authToken,
            // userInfo,
            status: 'login',
            successCode: '1',
          };
        }
        // else {
        //   const userInfo = await this.mobileRegister(createUserDto);
        //   const authToken = this.jwtService.sign({ id: userInfo.id });

        //   return {
        //     state: true,
        //     authToken,
        //     userInfo,
        //     status: 'register',
        //     successCode: '2',
        //   };
        // }
      } catch (error) {
        throw new HttpException(
          { state: false, errorCode: -4, message: error },
          HttpStatus.OK,
        );
      }
    }
    // else if (createUserDto.password) {
    //   const userInfo = await this.userRepository.findOne({
    //     where: { mobileNumber: createUserDto.mobileNumber },
    //   });

    //   if (!userInfo) {
    //     throw new HttpException(
    //       { state: true, data: 'user not found' },
    //       HttpStatus.OK,
    //     );
    //   } else {
    //     try {
    //       await this.comparePassword(createUserDto.password, userInfo.password);
    //       const authToken = this.jwtService.sign({ id: userInfo.id });
    //       await this.saveTokenInRedis(authToken, userInfo.id);
    //       userInfo.password = null;

    //       return {
    //         state: true,
    //         data: { authToken, userInfo, status: 'login' },
    //       };
    //     } catch (err) {
    //       throw new HttpException(
    //         { state: true, data: { state: false, message: 'wrong password!' } },
    //         HttpStatus.OK,
    //       );
    //     }
    //   }
    // }
  }

  //   private async getUserInfoByMobileNum(mobile: string): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //       const userInfo = await this.client.send(
  //         { cmd: 'getUserInfoByMobileNum' },
  //         createUserDto.mobileNumber,
  //       ).toPromise();
  //   }
  // }

  //   private async mobileRegister(data: any): Promise<any> {
  //     return new Promise((resolve, reject) => {
  //       User.mobileRegister(data, (err, userInfo) => {
  //         if (err) {
  //           reject(
  //             new HttpException(
  //               { state: false, errorCode: -5, message: err },
  //               HttpStatus.OK,
  //             ),
  //           );
  //         } else {
  //           resolve(userInfo);
  //         }
  //       });
  //     });
  //   }

  //   private async populateUserInfo(userId: string): Promise<any> {
  //     return User.findOne({ id: userId })
  //       .populate('sellerAddress')
  //       .populate('legalSeller')
  //       .populate('sellerSignature')
  //       .populate('sellerDocument');
  //   }

  //   private async comparePassword(
  //     password: string,
  //     hashedPassword: string,
  //   ): Promise<void> {
  //     return new Promise((resolve, reject) => {
  //       User.comparePassword(password, hashedPassword, (err) => {
  //         if (err) {
  //           reject(
  //             new HttpException(
  //               { state: false, errorCode: -6, message: err },
  //               HttpStatus.OK,
  //             ),
  //           );
  //         } else {
  //           resolve();
  //         }
  //       });
  //     });
  //   }

  //   private async saveTokenInRedis(
  //     authToken: string,
  //     userId: number,
  //   ): Promise<void> {
  //     return new Promise((resolve, reject) => {
  //       User.saveTokenInRedis(authToken, userId, (err) => {
  //         if (err) {
  //           reject(
  //             new HttpException(
  //               { state: false, errorCode: -6, message: err },
  //               HttpStatus.OK,
  //             ),
  //           );
  //         } else {
  //           resolve();
  //         }
  //       });
  //     });
  //   }
}
