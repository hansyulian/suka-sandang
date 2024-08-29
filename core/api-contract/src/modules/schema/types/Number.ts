import { BaseSpec, OptionalSpec } from './Base';

export type NumberSpecOptions = {
  min?: number;
  max?: number;
};
export type NumberSpec = BaseSpec<'number', NumberSpecOptions>;

export type NumbersSpec = BaseSpec<'numbers', NumberSpecOptions>;
export type OptionalNumberSpec = NumberSpec & OptionalSpec<number>;
export type OptionalNumbersSpec = NumbersSpec & OptionalSpec<number[]>;
