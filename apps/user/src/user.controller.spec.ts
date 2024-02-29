import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import {
  HttpException,
  //  HttpStatus, ConflictException
} from '@nestjs/common';
// import { CreateUserDto } from './dtos/create-user.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
// import { ActiveStatus, Gender, HideHelpStatus, UserType } from '@app/common';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  // describe('create', () => {
  //   it('should create a new user', async () => {
  //     const createUserDto: CreateUserDto = {
  //       username: 'miladfallah2000',
  //       password: '12345678',
  //       email: 'falahmilad79@gmail.com',
  //       nationalCode: '4900893714',
  //       firstName: 'milad',
  //       lastName: 'fallah',
  //       gender: Gender.Male,
  //       phoneNumber: '02165753601',
  //       mobileNumber: '09941108375',
  //       id: 1,
  //       userType: UserType.Seller,
  //       picture: 'https://i.ibb.co/z4z4z4z/user.png',
  //       hideHelp: HideHelpStatus.True,
  //       lastSeen: 1629499200000,
  //       active: ActiveStatus.ACTIVE,
  //       createdAt: 1629499200000,
  //       updatedAt: 1629499200000,
  //     };

  //     jest.spyOn(userService, 'create').mockResolvedValueOnce({
  //       // Mock the created user object
  //       id: 1,
  //       ...createUserDto,
  //       hashedPassword: '123' as any,
  //     });

  //     const result = await userController.create(createUserDto);

  //     expect(result).toEqual({
  //       state: true,
  //       user: expect.objectContaining({
  //         id: 1,
  //         ...createUserDto,
  //         hashedPassword: '123' as any,
  //       }),
  //     });
  //   });

  //   it('should handle other errors', async () => {
  //     const createUserDto: any = {};

  //     jest
  //       .spyOn(userService, 'create')
  //       .mockRejectedValueOnce(new Error('Some unexpected error'));

  //     await expect(userController.create(createUserDto)).rejects.toThrow(
  //       new HttpException(
  //         { message: 'Internal Server Error' },
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       ),
  //     );
  //   });
  //   it('should handle username conflict', async () => {
  //     const createUserDto: any = {
  //       username: 'miladfallah2000',

  //       // ... other properties
  //     };

  //     jest
  //       .spyOn(userService, 'create')
  //       .mockRejectedValueOnce(
  //         new ConflictException('Username is already taken'),
  //       );

  //     await expect(userController.create(createUserDto)).rejects.toThrow(
  //       new HttpException(
  //         { state: false, message: 'Username is already taken' },
  //         HttpStatus.CONFLICT,
  //       ),
  //     );
  //   });
  // });

  describe('checkUserPasswordStatus', () => {
    describe('checkUserPasswordStatus', () => {
      it('should return the correct response when user exists with password', async () => {
        const input = { mobileNumber: '1234567890' };
        const userExistSpy = jest
          .spyOn(userService, 'checkUserPasswordStatus')
          .mockResolvedValue({ password: 'password', userType: 'userType' });

        const result = await userController.checkUserPasswordStatus(input);

        expect(result).toEqual({ password: 'password', userType: 'userType' });
        expect(userExistSpy).toHaveBeenCalledWith(input);
      });
      it('should return the correct response when user exists without password', async () => {
        const input = { mobileNumber: '1234567890' };
        const userExistSpy = jest
          .spyOn(userService, 'checkUserPasswordStatus')
          .mockResolvedValue({ password: '', userType: 'userType' });

        const result = await userController.checkUserPasswordStatus(input);

        expect(result).toEqual({ password: '', userType: 'userType' });
        expect(userExistSpy).toHaveBeenCalledWith(input);
      });

      it('should return the correct response when user does not exist', async () => {
        const input = { mobileNumber: '1234567890' };
        const userExistSpy = jest
          .spyOn(userService, 'checkUserPasswordStatus')
          .mockResolvedValue({ password: '', userType: '0' });

        const result = await userController.checkUserPasswordStatus(input);

        expect(result).toEqual({ password: '', userType: '0' });
        expect(userExistSpy).toHaveBeenCalledWith(input);
      });

      it('should throw HttpException for internal server error', async () => {
        const input = { mobileNumber: '1234567890' };
        const error = new Error('Internal Server Error');
        const userExistSpy = jest
          .spyOn(userService, 'checkUserPasswordStatus')
          .mockRejectedValue(error);

        await expect(
          userController.checkUserPasswordStatus(input),
        ).rejects.toThrowError(HttpException);
        expect(userExistSpy).toHaveBeenCalledWith(input);
      });
    });
  });

  describe('getUserInfoByMobileNumber', () => {
    it('should return user info when successful', async () => {
      const mockMobileNumber = '1234567890';
      const mockUserRecord: any = {
        id: 1,
        mobileNumber: mockMobileNumber,
        createdAt: 1234567890,
      };

      jest
        .spyOn(userService, 'getUserInfoByMobileNumber')
        .mockResolvedValue(mockUserRecord);

      const result =
        await userController.getUserInfoByMobileNumber(mockMobileNumber);
      expect(result).toEqual(mockUserRecord);
    });

    it('should throw an HTTP exception when an error occurs in the service', async () => {
      const mockMobileNumber = '1234567890';

      jest
        .spyOn(userService, 'getUserInfoByMobileNumber')
        .mockRejectedValue(new Error('Internal server error'));

      await expect(
        userController.getUserInfoByMobileNumber(mockMobileNumber),
      ).rejects.toThrow('Internal server error');
    });
  });
  describe('registerByMobileNumber', () => {
    it('should return a user when registration is successful', async () => {
      const mockMobileNumber = '1234567890';
      const mockUser: any = {
        id: 1,
        mobileNumber: mockMobileNumber,
        createdAt: 1234567890,
      };

      jest
        .spyOn(userService, 'registerByMobileNumber')
        .mockResolvedValue(mockUser);

      const result =
        await userController.registerByMobileNumber(mockMobileNumber);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error when registration fails', async () => {
      const mockMobileNumber = '1234567890';

      jest
        .spyOn(userService, 'registerByMobileNumber')
        .mockRejectedValue(new Error('Registration failed'));

      await expect(
        userController.registerByMobileNumber(mockMobileNumber),
      ).rejects.toThrow('Registration failed');
    });
  });
});
