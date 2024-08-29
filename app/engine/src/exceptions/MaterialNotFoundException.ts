import { Exception } from "@hyulian/common";

export class MaterialNotFoundException extends Exception {
  constructor(details: object = {}, reference?: string) {
    super("MaterialNotFound", details, reference);
  }
}
