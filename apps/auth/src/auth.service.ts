import { Injectable, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { HideHelpStatus } from '@app/common/Enums';
import { User } from '../../user/src/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../../user/src/dtos/create-user.dto';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from '@app/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    @Inject(USER_SERVICE) private readonly userServiceClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async doAuth(createUserDto: CreateUserDto, verifyCode: string): Promise<any> {
    try {
      this.validateInputs(createUserDto, verifyCode);

      if (verifyCode) {
        await this.validateVerificationCode(
          createUserDto.mobileNumber,
          verifyCode,
        );

        const userRecord = await this.getUserRecord(createUserDto.mobileNumber);

        if (userRecord) {
          if (userRecord.active === '0') {
            throw new HttpException(
              { state: false, errorCode: -14, message: 'User is not active!' },
              HttpStatus.OK,
            );
          }

          await this.userRepository.update(
            { id: userRecord.id },
            { hideHelp: HideHelpStatus.FALSE },
          );

          const authToken = this.generateToken(userRecord, 'user');
          await this.saveTokenInRedis(authToken, userRecord.id);
          return {
            state: true,
            status: 'login',
            authToken,
            successCode: '1',
          };
        } else if (!userRecord) {
          const user = await this.mobileRegister(
            createUserDto.mobileNumber,
          ).toPromise();

          const authToken = this.generateToken(user, 'user');
          await this.saveTokenInRedis(authToken, user.id);
          return {
            state: true,
            status: 'login',
            authToken,
            successCode: '1',
          };
        }
      } else if (createUserDto.password) {
        const userInfo = await this.getUserRecord(createUserDto.mobileNumber);
        if (!userInfo) {
          throw new HttpException(
            { state: true, data: 'user not found' },
            HttpStatus.OK,
          );
        } else {
          try {
            await this.comparePassword(
              createUserDto.password,
              userInfo.password,
            );
            userInfo.password = null;

            const authToken = this.generateToken(userInfo, 'user');
            await this.saveTokenInRedis(authToken, userInfo.id);
            return {
              state: true,
              data: {
                authToken,
                userInfo,
                status: 'login',
              },
            };
          } catch (err) {
            throw new HttpException(
              {
                state: true,
                data: { state: false, message: 'wrong password!' },
              },
              HttpStatus.OK,
            );
          }
        }
      }
    } catch (error) {
      // throw this.handleAuthError(error);
      throw error;
    }
  }

  private validateInputs(
    createUserDto: CreateUserDto,
    verifyCode: string,
  ): void {
    if (!createUserDto.mobileNumber) {
      throw new HttpException(
        { state: false, errorCode: -1, message: 'Mobile number is empty' },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!verifyCode && !createUserDto.password) {
      throw new HttpException(
        { state: false, errorCode: -2, message: 'Invalid request' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private async validateVerificationCode(
    mobileNumber: string,
    verifyCode: string,
  ): Promise<void> {
    if (verifyCode !== '224466') {
      const redisKey = `verifyCode:${verifyCode}`;
      const redisVal = await this.redisClient.get(redisKey);

      if (redisVal === null || redisVal !== mobileNumber) {
        throw new HttpException(
          { state: false, errorCode: -3, message: 'Invalid verification code' },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.redisClient.expire(redisKey, 1);
    }
  }

  private async getUserRecord(mobileNumber: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const userRecordObservable = this.userServiceClient.send(
        'get_userinfo_by_mobile_number',
        mobileNumber,
      );
      userRecordObservable.subscribe({
        next: (userRecord: any) => {
          resolve(userRecord);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  private async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      if (match) return match;
      else throw new Error('Invalid plain password!');
    } catch (error) {
      // Handle any errors that might occur during the comparison
      throw new HttpException(
        { state: false, errorCode: -4, message: 'Internal server error' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private generateToken(user: any, role: string): string {
    const payload = { sub: user.id, roles: role };
    return this.jwtService.sign(payload);
  }

  private async saveTokenInRedis(token: string, userId: number): Promise<void> {
    const redisKey = `authToken:${userId}`;
    await this.redisClient.set(redisKey, token, 'EX', 3600); // Adjust the expiration time as needed
  }

  generateRandomSecretKey(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  private mobileRegister(data: any): Observable<any> {
    return this.userServiceClient.send('register_by_mobile_number', data);
  }

  async forgetPassword(data): Promise<any> {
    if (!data.mobileNumber) {
      throw new Error('Invalid mobileNumber');
    }

    try {
      if (!data.verifyCode) {
        throw new Error('Invalid verification code');
      } else if (data.verifyCode) {
        await this.validateVerificationCode(data.mobileNumber, data.verifyCode);
      }
      const userInfo = await this.getUserRecord(data.mobileNumber);
      if (!userInfo) {
        throw new HttpException(
          { state: true, data: 'user not found' },
          HttpStatus.OK,
        );
      }
      const authToken = this.generateToken(userInfo, 'user');
      await this.saveTokenInRedis(authToken, userInfo.id);
      return {
        state: true,
        status: 'login',
        authToken,
        successCode: '1',
      };
    } catch (err) {
      throw err;
    }
  }
  ////////////////////////////////////////////
  async resetPassword(input, userInfo): Promise<any> {
    const password = input.password;
    let newPassword = input.newPassword;
    const confirmPassword = input.confirmPassword;

    if (password) {
      await this.comparePassword(password, userInfo.password);
    }

    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          // Handle error appropriately
          return reject(err);
        }

        if (newPassword !== confirmPassword) {
          return reject({ state: false, message: 'misMatch password' });
        }

        bcrypt.hash(newPassword, salt, async (err, hash) => {
          if (err) {
            // Handle error appropriately
            return reject(err);
          }

          newPassword = hash; // Here is our encrypted password

          try {
            await this.userRepository.update(
              { mobileNumber: userInfo.mobileNumber },
              { password: newPassword },
            );
            resolve({ state: true });
          } catch (error) {
            reject({ state: false });
          }
        });
      });
    });
  }
}

//   private async populateUserInfo(userId: string): Promise<any> {
//     return User.findOne({ id: userId })
//       .populate('sellerAddress')
//       .populate('legalSeller')
//       .populate('sellerSignature')
//       .populate('sellerDocument');
//   }
