import { MaterialStatus } from "@app/common";
import { Exception } from "@hyulian/common";

export class MaterialInvalidStatusException extends Exception {
  constructor(expectation: MaterialStatus, reality: any, reference?: string) {
    super(
      "MaterialInvalidStatus",
      {
        expectation,
        reality,
      },
      reference
    );
  }
}
