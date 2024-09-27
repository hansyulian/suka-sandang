import { Engine } from "~/Engine";

export abstract class FacadeBase {
  private parent: Engine;

  public constructor(parent: Engine) {
    this.parent = parent;
  }

  protected get engine() {
    return this.parent;
  }
}
