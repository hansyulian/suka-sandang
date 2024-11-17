import { Engine } from "~/CoreEngine";

export abstract class EngineBase {
  private _core: Engine;

  public constructor(parent: Engine) {
    this._core = parent;
  }

  protected get engine() {
    return this._core;
  }

  public get sequelize() {
    return this._core.sequelize;
  }

  public get transactionMutex() {
    return this.engine.transactionMutex;
  }

  public set transactionMutex(value: boolean) {
    this.engine.transactionMutex = value;
  }
}
