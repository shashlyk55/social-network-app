import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { PostsModule } from '../posts/posts.module';
import { CommentsModule } from '../comments/comments.module';
import { ChatsModule } from '../chats/chats.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { WinstonLoggerModule } from '../winston-logger/winston-logger.module';
import { WinstonLoggerService } from '../winston-logger/winston-logger.service';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { WinstonExceptionsFilter } from '../winston-logger/winston-exceptions.filter';
import { WinstonLoggingInterceptor } from '../winston-logger/winston-logging.interceptor';
import { GlobalExceptionFilter } from './exceptions/global-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['core.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: +configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        schema: configService.get('POSTGRES_SCHEMA'),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: configService.get('POSTGRES_SYNCHRONIZE'),
        logging: configService.get('POSTGRES_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    ChatsModule,
    NotificationsModule,
    WinstonLoggerModule,
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
