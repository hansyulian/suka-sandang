import { Engine, EngineTransactionWrapperCallback } from "~/Engine";

export abstract class FacadeBase {
  private _core: Engine;

  public constructor(parent: Engine) {
    this._core = parent;
  }

  protected get engine() {
    return this._core;
  }

  protected async transactionManager() {
    return this.engine.transactionManager();
  }

  protected get transaction() {
    return this.engine.transaction;
  }

  public async withTransaction<ReturnType>(
    callback: EngineTransactionWrapperCallback<ReturnType>
  ) {
    return this.engine.withTransaction(callback);
  }
}
