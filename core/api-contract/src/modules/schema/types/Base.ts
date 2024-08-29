// DefaultValueType can be a TType or a function that returns TType
export type DefaultValueType<TType> =
  | TType
  | ((value: any, values: any) => TType);

// OptionalSpec extends BaseSpec and adds optional and defaultValue properties
export type OptionalSpec<TType = any> = {
  optional?: boolean;
  defaultValue?: DefaultValueType<TType>;
};

// BaseSpec defines the base structure of a specification with a type and an optional extension
export type BaseSpec<TTypeName extends string, TExtension extends {} = {}> = {
  type: TTypeName;
} & TExtension;
