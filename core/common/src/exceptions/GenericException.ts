import { Exception } from './Exception';

export class GenericException extends Exception<{ message: string }> {
  public constructor(message: string, reference?: string) {
    super('generic', { message }, reference);
  }
}
