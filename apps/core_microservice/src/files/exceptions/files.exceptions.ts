import { DomainException } from 'src/app/exceptions/domain.exception';

export class CreateDirFailed extends DomainException {
  code = 'CREATE_DIR_FAILED';

  constructor() {
    super('Failed to create directory');
  }
}

export class CreateFileFailed extends DomainException {
  code = 'CREATE_FILE_FAILED';

  constructor() {
    super('Failed to create file');
  }
}

export class FileNotFound extends DomainException {
  code = 'FILE_NOT_FOUND';

  constructor() {
    super('File not found');
  }
}
