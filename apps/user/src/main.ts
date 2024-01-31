import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  // Use the ValidationPipe globally
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
