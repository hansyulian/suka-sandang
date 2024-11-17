import { Exception } from "@hyulian/common";

export class MaterialDuplicationException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("MaterialDuplication", details, reference);
  }
}
