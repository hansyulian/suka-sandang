import {
  EnumFacade,
  MaterialFacade,
  SessionFacade,
  SupplierFacade,
  UserFacade,
} from "~/facades";

export type EngineOptions = {};
export class Engine {
  public options: EngineOptions = {};

  public user: UserFacade;
  public session: SessionFacade;
  public material: MaterialFacade;
  public enum: EnumFacade;
  public supplier: SupplierFacade;

  public constructor(options: EngineOptions = {}) {
    this.options = options;
    this.user = new UserFacade(this);
    this.session = new SessionFacade(this);
    this.material = new MaterialFacade(this);
    this.enum = new EnumFacade(this);
    this.supplier = new SupplierFacade(this);
  }
}
