import { DateString } from '../../custom';
import { BaseSpec, OptionalSpec } from './Base';

export type DateStringSpecOptions = {
  min?: Date;
  max?: Date;
};
export type DateStringSpec = BaseSpec<'dateString', DateStringSpecOptions>;
export type DateStringsSpec = BaseSpec<'dateStrings', DateStringSpecOptions>;
export type OptionalDateStringSpec = DateStringSpec & OptionalSpec<DateString>;
export type OptionalDateStringsSpec = DateStringsSpec &
  OptionalSpec<DateString[]>;
