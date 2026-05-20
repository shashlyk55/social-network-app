import { DomainException } from './domain.exception';

export abstract class InfrastructureException extends DomainException {
  constructor(
    message: string,
    public readonly rawError?: any,
  ) {
    super(message);
  }
}
