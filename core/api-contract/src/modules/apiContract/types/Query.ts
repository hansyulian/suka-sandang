import {
  OptionalBooleanSpec,
  OptionalBooleansSpec,
  OptionalDateStringSpec,
  OptionalDateStringsSpec,
  OptionalEnumSpec,
  OptionalEnumsSpec,
  OptionalNumberSpec,
  OptionalNumbersSpec,
  OptionalStringSpec,
  OptionalStringsSpec,
} from '../../schema';

export type ApiContractQuerySpec =
  | OptionalNumberSpec
  | OptionalStringSpec
  | OptionalBooleanSpec
  | OptionalDateStringSpec
  | OptionalEnumSpec
  | OptionalNumbersSpec
  | OptionalStringsSpec
  | OptionalBooleansSpec
  | OptionalDateStringsSpec
  | OptionalEnumsSpec;

export type ApiContractQuerySchema = Record<string, ApiContractQuerySpec>;
