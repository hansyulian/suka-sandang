import { BaseSpec, OptionalSpec } from './Base';

export type StringSpecOptions = {
  minLength?: number;
  maxLength?: number;
};

export type StringSpec = BaseSpec<'string', StringSpecOptions>;

export type StringsSpec = BaseSpec<'strings', StringSpecOptions>;
export type OptionalStringSpec = StringSpec & OptionalSpec<string>;
export type OptionalStringsSpec = StringsSpec & OptionalSpec<string[]>;
