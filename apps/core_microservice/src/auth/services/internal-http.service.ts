import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class InternalHttpService {
  constructor(private readonly httpService: HttpService) {}

  async post<T>(url: string, data: any): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.post<T>(url, data),
      );
      console.log('HTTP SERVICE');
      console.log(response.data);

      return response.data;
    } catch (error) {
      throw new InternalServerErrorException(
        `Auth Microservice error: ${error.response?.data?.message || error.message}`,
      );
    }
  }

  async delete(url: string): Promise<void> {
    try {
      await firstValueFrom(this.httpService.delete(url));
    } catch (error) {
      console.error(`Rollback request failed at ${url}`);
    }
  }
}
