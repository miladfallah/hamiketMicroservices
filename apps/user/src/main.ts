import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 4001,
    },
    // transport: Transport.RMQ,
    // options: {
    //   urls: ['amqp://localhost:5672'], // Change the RabbitMQ connection URL accordingly
    //   queue: 'user_queue', // Change the queue name accordingly
    // },
  });
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  // await app.listen(3001);
}
bootstrap();
