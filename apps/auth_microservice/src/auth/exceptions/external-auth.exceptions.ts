import { DomainException } from '../../common/exceptions/domain.exception';

export class ProviderNotSupported extends DomainException {
  code: string;

  constructor() {
    super('Provider not supported');
  }
}
