import { HttpException, HttpStatus } from '@nestjs/common';

/**
 * Exceptions, which appears during microservice http interaction.
 */
export class MicroserviceException extends HttpException {
  constructor(
    public readonly responseData: any,
    status: HttpStatus,
  ) {
    super(responseData, status);
  }
}
