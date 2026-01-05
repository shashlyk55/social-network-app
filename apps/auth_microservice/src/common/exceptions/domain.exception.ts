export abstract class DomainException extends Error {
  abstract code: string;

  // constructor(message: string) {
  //   super(message);
  //   this.name = this.constructor.name;
  // }

  constructor(
    operation: string,
    public readonly rawError?: any,
  ) {
    super(`Failed to ${operation}`);
  }
}
