import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { ChatsModule } from '../chats/chats.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WinstonLoggerModule } from '../winston-logger/winston-logger.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonExceptionsFilter } from '../winston-logger/winston-exceptions.filter';
import { WinstonLoggingInterceptor } from '../winston-logger/winston-logging.interceptor';
import { GlobalExceptionFilter } from './exceptions/global-exception.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AssetsModule } from 'src/assets/assets.module';
import { FollowModule } from 'src/follow/follow.module';
import { RabbitMqModule } from 'src/rabbit-mq/rabbit-mq.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['core.env'],
      isGlobal: true,
    }),
    RabbitMqModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('POSTGRES_HOST'),
        port: configService.get<number>('POSTGRES_PORT'),
        username: configService.get<string>('POSTGRES_USER'),
        password: configService.get<string>('POSTGRES_PASSWORD'),
        database: configService.get<string>('POSTGRES_DB'),
        schema: configService.get<string>('POSTGRES_SCHEMA'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('POSTGRES_SYNCHRONIZE'),
        logging: configService.get<boolean>('POSTGRES_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    PostsModule,
    FollowModule,
    AssetsModule,
    CommentsModule,
    ChatsModule,
    NotificationsModule,
    WinstonLoggerModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'local_storage'),
      serveRoot: '/uploads',
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: WinstonLoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: WinstonExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
