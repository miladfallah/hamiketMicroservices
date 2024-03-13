import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException } from '@nestjs/common';

jest.mock('./auth.service');

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: 'REDIS_CLIENT', // Replace with the actual token used in your AuthService
          useValue: {}, // Replace with a mock or the actual Redis client instance
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });
  describe('doAuth', () => {
    it('should return authentication result', async () => {
      const createUserDto: any = { mobileNumber: '09301234567' }; // Your test data
      const verifyCode = '123456'; // Your test verification code
      const authToken = '123456';
      const expectedResult = {
        state: true,
        status: 'login',
        authToken: authToken,
        successCode: '1',
      };

      jest.spyOn(authService, 'doAuth').mockResolvedValue(expectedResult);

      const result = await authController.doAuth(createUserDto, verifyCode);

      expect(result).toBe(expectedResult);
    });

    it('should handle validation errors', async () => {
      // Simulate validation error
      const createUserDto: any = {}; // Your invalid test data
      const verifyCode = ''; // Your test verification code

      jest
        .spyOn(authService, 'doAuth')
        .mockRejectedValue(new HttpException({}, 400));

      await expect(
        authController.doAuth(createUserDto, verifyCode),
      ).rejects.toThrow(HttpException);
    });

    it('should handle internal server error', async () => {
      const createUserDto: any = {}; // Your test data
      const verifyCode = '123456'; // Your test verification code

      jest
        .spyOn(authService, 'doAuth')
        .mockRejectedValue(new HttpException({}, 500));

      await expect(
        authController.doAuth(createUserDto, verifyCode),
      ).rejects.toThrowError(HttpException);
    });

    // Add more test cases as needed
  });
});
