import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: process.env.RABBITMQ_QUEUE || 'notifications_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT ?? 3003;
  await app.listen(port);
  console.log(
    `Notifications Consumer Microservice is listening on port ${port}...`,
  );
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   AppModule,
  //   {
  //     transport: Transport.RMQ,
  //     options: {
  //       urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
  //       queue: process.env.RABBITMQ_QUEUE || 'notifications_queue',
  //       queueOptions: { durable: true },
  //     },
  //   },
  // );
  // await app.listen();
  // console.log('Worker Microservice is listening...');
}
bootstrap();
