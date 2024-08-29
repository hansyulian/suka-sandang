import { DateString } from '../../custom';
import { BaseSpec, OptionalSpec } from './Base';
import {
  BooleanSpec,
  BooleansSpec,
  OptionalBooleanSpec,
  OptionalBooleansSpec,
} from './Boolean';
import {
  DateStringSpec,
  DateStringsSpec,
  OptionalDateStringSpec,
  OptionalDateStringsSpec,
} from './DateString';
import {
  EnumSpec,
  EnumsSpec,
  OptionalEnumSpec,
  OptionalEnumsSpec,
} from './Enum';
import {
  NumberSpec,
  NumbersSpec,
  OptionalNumberSpec,
  OptionalNumbersSpec,
} from './Number';
import {
  OptionalStringSpec,
  OptionalStringsSpec,
  StringSpec,
  StringsSpec,
} from './String';

export type OptionalValueCheck<
  TSpecification extends OptionalSpec,
  TReturnType,
> = TSpecification['optional'] extends true
  ? TReturnType | undefined
  : TReturnType;

/**
 * Define the specification specification type.
 */
export type Schema = Record<string, Specs>;

/**
 * Define the nested object typing
 */
export type ObjectSpecOptions = {
  spec: Schema;
};
export type ObjectSpec = BaseSpec<'object', ObjectSpecOptions>;
export type OptionalObjectSpec = ObjectSpec & OptionalSpec<{}>;
export type ObjectsSpec = BaseSpec<'objects', ObjectSpecOptions> &
  OptionalSpec<Array<Schema>>;
export type OptionalObjectsSpec = ObjectsSpec & OptionalSpec<[]>;

export type SchemaType<TSchema extends Schema> = {
  [Key in keyof TSchema]: OptionalValueCheck<
    TSchema[Key],
    InferSpecType<TSchema[Key]>
  >;
};
export type StrictSchemaType<TSchema extends Schema> = {
  [Key in keyof TSchema]: InferSpecType<TSchema[Key]>;
};

export type Specs =
  // primitived type
  | OptionalNumberSpec
  | OptionalStringSpec
  | OptionalBooleanSpec
  | OptionalDateStringSpec
  | OptionalEnumSpec
  | OptionalObjectSpec
  // array values
  | OptionalNumbersSpec
  | OptionalStringsSpec
  | OptionalBooleansSpec
  | OptionalDateStringsSpec
  | OptionalEnumsSpec
  | OptionalObjectsSpec; // array of object

/**
 * Utility type to infer the type from the specification value.
 */
export type InferSpecType<TSpecs extends Specs> =
  // string type checking
  TSpecs extends StringSpec
    ? string
    : // number type checking
      TSpecs extends NumberSpec
      ? number
      : // boolean type checking
        TSpecs extends BooleanSpec
        ? boolean
        : // dateString type checking
          TSpecs extends DateStringSpec
          ? DateString
          : // object type checking
            TSpecs extends ObjectSpec
            ? SchemaType<TSpecs['spec']>
            : // enum type checking
              TSpecs extends EnumSpec
              ? TSpecs['values'][number]
              : // Array checkings
                TSpecs extends StringsSpec
                ? string[]
                : // number type checking
                  TSpecs extends NumbersSpec
                  ? number[]
                  : // boolean type checking
                    TSpecs extends BooleansSpec
                    ? boolean[]
                    : // dateString type checking
                      TSpecs extends DateStringsSpec
                      ? DateString[]
                      : // object type checking
                        TSpecs extends ObjectsSpec
                        ? Array<SchemaType<TSpecs['spec']>>
                        : // enum type checking
                          TSpecs extends EnumsSpec
                          ? Array<TSpecs['values'][number]>
                          : // default says 'unableToInferTypingDebug' to make it easier to debug
                            // by right, this one should never occur unless it's a bug
                            TSpecs & 'unableToInferTypingDebug';
