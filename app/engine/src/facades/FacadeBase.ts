import { Transaction } from "sequelize";
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

  public get sequelize() {
    return this.engine.sequelize;
  }

  public get transaction() {
    return this.engine.transaction;
  }

  public set transaction(value: Transaction | undefined) {
    this.engine.transaction = value;
  }

  public get transactionMutex() {
    return this.engine.transactionMutex;
  }

  public set transactionMutex(value: boolean) {
    this.engine.transactionMutex = value;
  }

  public async withTransaction<ReturnType>(
    callback: EngineTransactionWrapperCallback<ReturnType>
  ) {
    return this.engine.withTransaction(callback);
  }
}
