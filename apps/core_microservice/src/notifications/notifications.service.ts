import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FindNotificationsParams } from './types/notification-service.types';

@Injectable()
export class NotificationsService {
  constructor() {}
}
