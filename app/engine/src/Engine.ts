import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
  EnumFacade,
  MaterialFacade,
  SessionFacade,
  SupplierFacade,
  UserFacade,
  CustomerFacade,
} from "~/facades";
import { PurchaseOrderFacade } from "~/facades/PurchaseOrderFacade";
import { TransactionManager } from "~/modules";
import { DBConfig, setupDatabase } from "~/setupDatabase";

export type EngineOptions = {
  database?: DBConfig;
};
export class Engine {
  public transaction?: Transaction;
  private sequelize: Sequelize;
  public options: EngineOptions;

  public user: UserFacade;
  public session: SessionFacade;
  public material: MaterialFacade;
  public enum: EnumFacade;
  public supplier: SupplierFacade;
  public customer: CustomerFacade;
  public purchaseOrder: PurchaseOrderFacade;

  public constructor(options: EngineOptions = {}) {
    this.options = options;
    this.sequelize = setupDatabase(options.database);
    this.user = new UserFacade(this);
    this.session = new SessionFacade(this);
    this.material = new MaterialFacade(this);
    this.enum = new EnumFacade(this);
    this.supplier = new SupplierFacade(this);
    this.customer = new CustomerFacade(this);
    this.purchaseOrder = new PurchaseOrderFacade(this);
  }

  public async transactionManager() {
    if (!this.transaction) {
      this.transaction = await this.sequelize.transaction();
      return new TransactionManager(this, true);
    }
    return new TransactionManager(this);
  }

  public async commitTransaction() {
    if (!this.transaction) {
      return;
    }
    this.transaction.commit();
    this.transaction = undefined;
  }

  public async rollbackTransaction() {
    if (!this.transaction) {
      return;
    }
    this.transaction.rollback();
    this.transaction = undefined;
  }
}
