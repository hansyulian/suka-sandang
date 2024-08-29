import { GetServerInfoContract } from './GetServerInfo';
import { SessionContracts } from './session';

export * from './session';
export * from './GetServerInfo';

export namespace ServiceContracts {
  export import Session = SessionContracts;
  export type GetServerInfo = GetServerInfoContract;
}
