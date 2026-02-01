import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { getHelmetConfig } from './config/helmet.config';
import { WinstonLoggerService } from './winston-logger/winston-logger.service';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const loggerService = app.get(WinstonLoggerService);

  loggerService.log('Initializing application...', 'Bootstrap');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Innogram')
    .setDescription('Innogram Social Network API')
    .setVersion('1.0')
    .addCookieAuth(
      'accessToken',
      {
        type: 'apiKey',
        in: 'cookie',
        name: 'accessToken',
        description: 'Enter JWT token in cookie',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.use((req, res, next) => {
    const origin = req.headers.origin;

    if (origin === 'http://localhost:3000') {
      res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    }

    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );

    if (req.method === 'OPTIONS') {
      return res.status(204).send();
    }

    next();
  });

  // app.enableCors(getCorsConfig());
  app.use(helmet(getHelmetConfig()));
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const result = errors.map((error) => ({
          property: error.property,
          constraints: error.constraints,
        }));
        return new BadRequestException(result);
      },
    }),
  );

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
