import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { getCorsConfig } from './config/cors.config';
import helmet from 'helmet';
import { getHelmetConfig } from './config/helmet.config';
import { WinstonLoggerService } from './winston-logger/winston-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerService = app.get(WinstonLoggerService);

  loggerService.log('Initializing application...', 'Bootstrap');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Innogram')
    .setDescription('Innogram Social Network API')
    .setVersion('1.0')
    .build();

  const documnet = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, documnet);

  app.use(helmet(getHelmetConfig()));
  app.use(cookieParser());
  app.enableCors(getCorsConfig());

  const port = process.env.PORT ?? 3001;

  await app.listen(port);

  loggerService.log(
    `Application is running on: ${await app.getUrl()}`,
    'Bootstrap',
    {
      port,
      timestamp: new Date().toISOString(),
    },
  );
}
bootstrap();
