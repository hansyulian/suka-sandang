import { Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";
import {
  EnumFacade,
  MaterialFacade,
  SessionFacade,
  SupplierFacade,
  UserFacade,
  CustomerFacade,
  InventoryFacade,
} from "~/facades";
import { InventoryFlowFacade } from "~/facades/InventoryFlowFacade";
import { PurchaseOrderFacade } from "~/facades/PurchaseOrderFacade";
import { PurchaseOrderItemFacade } from "~/facades/PurchaseOrderItemFacade";
import { DBConfig, setupDatabase } from "~/setupDatabase";

export type EngineOptions = {
  database?: DBConfig;
};
export type EngineTransactionWrapperCallback<ReturnType> = (
  transaction: Transaction
) => PromiseLike<ReturnType>;
export class Engine {
  private _sequelize: Sequelize;
  public transactionMutex: boolean = false;
  public options: EngineOptions;

  public user: UserFacade;
  public session: SessionFacade;
  public material: MaterialFacade;
  public enum: EnumFacade;
  public supplier: SupplierFacade;
  public customer: CustomerFacade;
  public purchaseOrder: PurchaseOrderFacade;
  public purchaseOrderItem: PurchaseOrderItemFacade;
  public inventory: InventoryFacade;
  public inventoryFlow: InventoryFlowFacade;

  public constructor(options: EngineOptions = {}) {
    this.options = options;
    this._sequelize = setupDatabase(options.database);
    this.user = new UserFacade(this);
    this.session = new SessionFacade(this);
    this.material = new MaterialFacade(this);
    this.enum = new EnumFacade(this);
    this.supplier = new SupplierFacade(this);
    this.customer = new CustomerFacade(this);
    this.purchaseOrder = new PurchaseOrderFacade(this);
    this.purchaseOrderItem = new PurchaseOrderItemFacade(this);
    this.inventory = new InventoryFacade(this);
    this.inventoryFlow = new InventoryFlowFacade(this);
  }

  public get sequelize() {
    return this._sequelize;
  }
}
