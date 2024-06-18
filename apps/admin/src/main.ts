import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AdminModule } from './admin.module';

async function bootstrap() {
  const app = await NestFactory.create(AdminModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4002,
    },
  });
  await app.startAllMicroservices();

  // await app.listen(3001);
}
bootstrap();
