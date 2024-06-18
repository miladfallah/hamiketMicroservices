import { Injectable, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AppError } from './appError';

@Injectable()
export class PasswordService {
  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    try {
      const match = await bcrypt.compare(plainPassword, hashedPassword);
      if (match) {
        return match;
      } else {
        throw new AppError('Invalid plain password!', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      // Check if it's a known error or an internal error
      if (error instanceof AppError) {
        throw error; // If it's a known error, rethrow it
      } else {
        // If it's an internal error, handle it and throw an appropriate error
        throw new AppError(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
