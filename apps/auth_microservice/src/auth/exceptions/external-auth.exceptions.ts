import { DomainException } from 'src/common/exceptions/domain.exception';

export class ProviderNotSupported extends DomainException {
  code: string;

  constructor() {
    super('Provider not supported');
  }
}
