import { dateStringUtil } from "../custom/DateString";
import { OptionalSpec } from "./types/Base";
import { BooleanSpecOptions } from "./types/Boolean";
import { DateStringSpecOptions } from "./types/DateString";
import { EnumSpecOptions } from "./types/Enum";
import { NumberSpecOptions } from "./types/Number";
import { ObjectSpecOptions, Schema, SchemaType, Specs } from "./types/Spec";
import { StringSpecOptions } from "./types/String";

type ProjectorFunction<TSpecs extends Specs, TReturnType> = (
  value: any,
  spec: TSpecs
) => TReturnType;

export function projectSchema<
  TValue extends SchemaType<TSchema>,
  TSchema extends Schema
>(values: TValue, schema: TSchema) {
  type TReturnType = SchemaType<typeof schema>;
  const result: any = {};
  const keys = Object.keys(schema);
  for (const key of keys) {
    const initialValue = values[key];
    const spec = schema[key];
    const optionalProcessedValue = handleDefault(initialValue, values, spec);
    if (optionalProcessedValue === undefined) {
      result[key] = undefined;
    } else {
      result[key] = projectValue(optionalProcessedValue, spec);
    }
  }
  return result as TReturnType;
}
function projectValue(value: any, spec: Specs) {
  switch (spec.type) {
    case "boolean":
      return projectBoolean(value, spec);
    case "number":
      return projectNumber(value, spec);
    case "string":
      return projectString(value, spec);
    case "dateString":
      return projectDateString(value, spec);
    case "object":
      return projectObject(value, spec);
    case "enum":
      return projectEnum(value, spec);
    // array
    case "booleans":
      return genericProjectArray(projectBoolean, value, spec);
    case "numbers":
      return genericProjectArray(projectNumber, value, spec);
    case "strings":
      return genericProjectArray(projectString, value, spec);
    case "dateStrings":
      return genericProjectArray(projectDateString, value, spec);
    case "objects":
      return genericProjectArray(projectObject, value, spec);
    case "enums":
      return genericProjectArray(projectEnum, value, spec);
  }
}

function handleDefault<TType>(
  value: any,
  values: any,
  optionalSpec: OptionalSpec<TType>
): TType | undefined {
  if (value !== null && value !== undefined) {
    return value;
  }
  const defaultValue = optionalSpec.defaultValue;

  if (optionalSpec.defaultValue) {
    return typeof defaultValue === "function"
      ? (defaultValue as any)(value, values)
      : optionalSpec.defaultValue;
  }
  return undefined;
}

function genericProjectArray<TSpecs extends Specs, ReturnType>(
  projector: ProjectorFunction<TSpecs, ReturnType>,
  value: any[],
  spec: TSpecs
) {
  // there is no need to check the undefined, when the values are being looped here,
  // they will definitely not undefined unless really specified value is [undefined,...]
  // in this case we will need to filter out all those undefineds
  return value.filter((v) => v !== undefined).map((v) => projector(v, spec));
}

function projectBoolean(value: any, spec: BooleanSpecOptions) {
  return !!value;
}

function projectNumber(value: any, spec: NumberSpecOptions) {
  return Number(value);
}

function projectString(value: any, spec: StringSpecOptions) {
  return String(value);
}

function projectDateString(value: any, spec: DateStringSpecOptions) {
  return dateStringUtil.toDateString(value);
}

function projectObject(value: any, spec: ObjectSpecOptions) {
  const objectResult = projectSchema(value as any, spec.spec);
  return objectResult as SchemaType<typeof spec.spec>;
}

// in case the value isn't in the enums, what shall be done?
// 1: make undefined, but then it make the value to be always Enums | undefined
// 2: assume do nothing for projection, which assume always correct since it's already typechecked
function projectEnum<TEnums extends string>(
  value: string,
  spec: EnumSpecOptions<TEnums>
) {
  return value;
}
