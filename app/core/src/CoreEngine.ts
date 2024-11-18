import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import { SalesOrderEngine, SalesOrderItemEngine } from "~/engine";
import { CustomerEngine } from "~/engine/CustomerEngine";
import { EnumEngine } from "~/engine/EnumEngine";
import { InventoryEngine } from "~/engine/InventoryEngine";
import { InventoryFlowEngine } from "~/engine/InventoryFlowEngine";
import { MaterialEngine } from "~/engine/MaterialEngine";
import { PurchaseOrderEngine } from "~/engine/PurchaseOrderEngine";
import { PurchaseOrderItemEngine } from "~/engine/PurchaseOrderItemEngine";
import { SessionEngine } from "~/engine/SessionEngine";
import { SupplierEngine } from "~/engine/SupplierEngine";
import { UserEngine } from "~/engine/UserEngine";
import { DBConfig, setupDatabase } from "~/setupDatabase";

export type EngineOptions = {
  database?: DBConfig;
};
export type EngineConstructor = {
  sequelizeInstance?: Sequelize;
};
export type EngineTransactionWrapperCallback<ReturnType> = (
  transaction: Transaction
) => PromiseLike<ReturnType>;
export class Engine {
  private _sequelize: Sequelize;
  public transactionMutex: boolean = false;
  public options: EngineOptions;

  public customer: CustomerEngine;
  public enum: EnumEngine;
  public inventory: InventoryEngine;
  public inventoryFlow: InventoryFlowEngine;
  public material: MaterialEngine;
  public purchaseOrder: PurchaseOrderEngine;
  public purchaseOrderItem: PurchaseOrderItemEngine;
  public salesOrder: SalesOrderEngine;
  public salesOrderItem: SalesOrderItemEngine;
  public session: SessionEngine;
  public supplier: SupplierEngine;
  public user: UserEngine;

  public constructor(options: EngineOptions & EngineConstructor = {}) {
    const { sequelizeInstance, ...rest } = options;
    this.options = rest;
    this._sequelize = sequelizeInstance || setupDatabase(options.database);
    this.customer = new CustomerEngine(this);
    this.enum = new EnumEngine(this);
    this.inventory = new InventoryEngine(this);
    this.inventoryFlow = new InventoryFlowEngine(this);
    this.material = new MaterialEngine(this);
    this.purchaseOrder = new PurchaseOrderEngine(this);
    this.purchaseOrderItem = new PurchaseOrderItemEngine(this);
    this.salesOrder = new SalesOrderEngine(this);
    this.salesOrderItem = new SalesOrderItemEngine(this);
    this.session = new SessionEngine(this);
    this.supplier = new SupplierEngine(this);
    this.user = new UserEngine(this);
  }

  public get sequelize() {
    return this._sequelize;
  }
}
