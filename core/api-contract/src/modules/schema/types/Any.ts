import { BaseSpec, OptionalSpec } from "./Base";

export type AnySpecOptions = {};
export type AnySpec = BaseSpec<"any", AnySpecOptions>;
export type AnysSpec = BaseSpec<"anys", AnySpecOptions>;
export type OptionalAnySpec = AnySpec & OptionalSpec<any>;
export type OptionalAnysSpec = AnysSpec & OptionalSpec<any[]>;
