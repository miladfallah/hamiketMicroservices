import { HttpException, HttpStatus } from '@nestjs/common';

export class AppError extends HttpException {
  constructor(message: string, status: HttpStatus) {
    super({ error: message }, status);
  }
}
