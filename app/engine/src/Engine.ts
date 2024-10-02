import {
  EnumFacade,
  MaterialFacade,
  SessionFacade,
  SupplierFacade,
  UserFacade,
  CustomerFacade,
} from "~/facades";

export type EngineOptions = {};
export class Engine {
  public options: EngineOptions = {};

  public user: UserFacade;
  public session: SessionFacade;
  public material: MaterialFacade;
  public enum: EnumFacade;
  public supplier: SupplierFacade;
  public customer: CustomerFacade;

  public constructor(options: EngineOptions = {}) {
    this.options = options;
    this.user = new UserFacade(this);
    this.session = new SessionFacade(this);
    this.material = new MaterialFacade(this);
    this.enum = new EnumFacade(this);
    this.supplier = new SupplierFacade(this);
    this.customer = new CustomerFacade(this);
  }
}
