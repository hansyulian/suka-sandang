import { Engine } from "~/Engine";

export class TransactionManager {
  private engine: Engine;
  private master: boolean;

  constructor(engine: Engine, master = false) {
    this.engine = engine;
    this.master = master;
  }

  public get isMaster() {
    return this.master;
  }

  public get transaction() {
    return this.engine.transaction;
  }

  public async commit() {
    if (!this.master) {
      return;
    }
    return this.engine.commitTransaction();
  }

  public async rollback() {
    if (!this.master) {
      return;
    }
    return this.engine.rollbackTransaction();
  }
}
