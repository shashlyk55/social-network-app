import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NotificationsConsumerModule } from '@/notifications-consumer/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['notifications-consumer.env'],
      isGlobal: true,
    }),
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
    NotificationsConsumerModule,
  ],
})
export class AppModule {}
