import { DomainException } from '../../app/exceptions/domain.exception';

export class AssetNotFound extends DomainException {
  code = 'ASSET_NOT_FOUND';

  constructor(id?: number) {
    super(id ? `Asset with ${id} not found` : 'Asset not found');
  }
}

export class AssetOperationException extends DomainException {
  code = 'ASSET_OPERATION_FAILED';

  constructor(operation: string, reason?: string) {
    super(
      reason ? `Failed to ${operation}: ${reason}` : `Failed to ${operation}`,
    );
  }
}
