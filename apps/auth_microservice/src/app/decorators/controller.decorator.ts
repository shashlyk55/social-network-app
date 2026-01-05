import { Request, Response, NextFunction } from 'express';

export function HandleExceptions(
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
      next(error);
    }
  };

  return descriptor;
}
