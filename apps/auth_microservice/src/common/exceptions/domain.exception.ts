export abstract class DomainException extends Error {
  abstract code: string;

  constructor(
    message: string,
    public readonly rawError?: any,
  ) {
    super(message);
  }
}
