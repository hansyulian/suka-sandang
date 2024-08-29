import { BaseSpec, OptionalSpec } from './Base';

export type BooleanSpecOptions = {};
export type BooleanSpec = BaseSpec<'boolean', BooleanSpecOptions>;
export type BooleansSpec = BaseSpec<'booleans', BooleanSpecOptions>;
export type OptionalBooleanSpec = BooleanSpec & OptionalSpec<boolean>;
export type OptionalBooleansSpec = BooleansSpec & OptionalSpec<boolean[]>;
