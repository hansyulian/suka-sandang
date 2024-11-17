import { BaseSpec, OptionalSpec } from './Base';

/**
 * Represents a specification value for enums.
 */
export type EnumSpecOptions<TEnum extends string> = {
  readonly values: readonly TEnum[]; // todo: typestrict the enum
};

export type EnumSpec<TEnum extends string = string> = BaseSpec<
  'enum',
  EnumSpecOptions<TEnum>
>;
export type OptionalEnumSpec<TEnum extends string = string> = EnumSpec<TEnum> &
  OptionalSpec<TEnum>;
/**
 * Represents a specification value for enums array.
 */

export type EnumsSpec<TEnum extends string = any> = BaseSpec<
  'enums',
  EnumSpecOptions<TEnum>
>;
export type OptionalEnumsSpec<TEnum extends string = any> = EnumsSpec<TEnum> &
  OptionalSpec<TEnum[]>;
