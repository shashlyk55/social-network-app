import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../utils/response.helper';

export function AsyncController(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await originalMethod.call(this, req, res, next);
    } catch (error) {
      // Пробрасываем в глобальный обработчик
      next(error);
    }
  };

  return descriptor;
}

// Альтернатива: фабрика декораторов
export function HandleExceptions(
  errorHandler?: (error: Error, req: Request, res: Response) => void,
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (
      req: Request,
      res: Response,
      next: NextFunction,
    ) {
      try {
        const result = await originalMethod.call(this, req, res, next);

        // Если метод возвращает данные, отправляем успешный ответ
        if (result !== undefined && !res.headersSent) {
          ApiResponse.success(res, result);
        }

        return result;
      } catch (error) {
        // Кастомный обработчик или стандартный
        if (errorHandler) {
          errorHandler(error as Error, req, res);
        } else {
          next(error);
        }
      }
    };

    return descriptor;
  };
}
