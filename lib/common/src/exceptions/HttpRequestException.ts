import { Exception } from './Exception';

export class HttpRequestException extends Exception<{ code: string }> {
  constructor(code: string) {
    super('HttpRequestException', {
      code,
    });
  }
}
