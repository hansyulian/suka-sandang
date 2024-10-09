import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { UnexpectedDatabaseTransactionStateException } from "~/exceptions/UnexpectedDatabaseTransactionStateException";
import {
  EnumFacade,
  MaterialFacade,
  SessionFacade,
  SupplierFacade,
  UserFacade,
  CustomerFacade,
} from "~/facades";
import { PurchaseOrderFacade } from "~/facades/PurchaseOrderFacade";
import { PurchaseOrderItemFacade } from "~/facades/PurchaseOrderItemFacade";
import { EngineTransactionManager } from "~/modules";
import { DBConfig, setupDatabase } from "~/setupDatabase";

export type EngineOptions = {
  database?: DBConfig;
};
export type EngineTransactionWrapperCallback<ReturnType> = (
  transaction: Transaction
) => PromiseLike<ReturnType>;
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
  public purchaseOrderItem: PurchaseOrderItemFacade;

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
    this.purchaseOrderItem = new PurchaseOrderItemFacade(this);
  }

  public async transactionManager() {
    if (!this.transaction) {
      this.transaction = await this.sequelize.transaction();
      return new EngineTransactionManager(this, true);
    }
    return new EngineTransactionManager(this);
  }

  public async commitTransaction() {
    if (!this.transaction) {
      throw new UnexpectedDatabaseTransactionStateException();
    }
    this.transaction.commit();
    this.transaction = undefined;
  }

  public async rollbackTransaction() {
    if (!this.transaction) {
      throw new UnexpectedDatabaseTransactionStateException();
    }
    this.transaction.rollback();
    this.transaction = undefined;
  }

  public async withTransaction<ReturnType>(
    callback: EngineTransactionWrapperCallback<ReturnType>
  ) {
    const tm = await this.transactionManager();
    if (!tm.transaction) {
      throw new UnexpectedDatabaseTransactionStateException();
    }
    try {
      const result = await callback(tm.transaction);
      await tm.commit();
      return result;
    } catch (err) {
      await tm.rollback();
      throw err;
    }
  }
}
