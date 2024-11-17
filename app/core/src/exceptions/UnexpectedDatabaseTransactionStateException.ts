import { Exception } from "@hyulian/common";

export class UnexpectedDatabaseTransactionStateException extends Exception {
  constructor(reference?: string) {
    super("UnexpectedDatabaseTransactionState", {}, reference);
  }
}
