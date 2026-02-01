import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { MicroserviceException } from './exceptions/microservice-http.exceptions';

@Injectable()
export class InternalHttpService {
  constructor(private readonly httpService: HttpService) {}

  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data),
      );

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new MicroserviceException(
          error.response.data,
          error.response.status,
        );
      }

      throw new InternalServerErrorException(
        `Service at ${url} is unavailable`,
      );
    }
  }

  async get<T>(url: string, data: any): Promise<T> {
    try {
      const response = await firstValueFrom(this.httpService.get<T>(url, data));

      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new MicroserviceException(
          error.response.data,
          error.response.status,
        );
      }

      throw new InternalServerErrorException(
        `Service at ${url} is unavailable`,
      );
    }
  }

  async delete(url: string): Promise<void> {
    try {
      await firstValueFrom(this.httpService.delete(url));
    } catch (error: any) {
      if (error.response) {
        throw new MicroserviceException(
          error.response.data,
          error.response.status,
        );
      }

      throw new InternalServerErrorException(
        `Service at ${url} is unavailable`,
      );
    }
  }
}
