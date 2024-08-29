import dayjs from 'dayjs';

import { SchemaValidationExceptionDetail } from '../../exceptions';
import { DateString, dateStringUtil } from '../custom';
import { OptionalSpec } from './types/Base';
import { BooleanSpecOptions } from './types/Boolean';
import { DateStringSpecOptions } from './types/DateString';
import { EnumSpecOptions } from './types/Enum';
import { NumberSpecOptions } from './types/Number';
import {
  InferSpecType,
  ObjectSpecOptions,
  Schema,
  SchemaType,
  Specs,
} from './types/Spec';
import { StringSpecOptions } from './types/String';

type ValidationReturn<T = any> = {
  errors: SchemaValidationExceptionDetail[];
  value: T;
};

type ValidatorFunction<TSpecs extends Specs, TReturnType> = (
  value: any,
  key: string,
  spec: TSpecs,
) => ValidationReturn<TReturnType>;

function joinKey(...args: (string | number)[]) {
  return args.filter((args) => !!args).join('.');
}
export function validateSchema<
  UTSchemaType extends SchemaType<TSchema>,
  TSchema extends Schema,
>(values: UTSchemaType, schema: TSchema, keyPrefix: string = '') {
  type ReturnType = SchemaType<typeof schema>;
  const result: any = {};
  const keys = Object.keys(schema);
  const errors: SchemaValidationExceptionDetail[] = [];
  for (const key of keys) {
    const initialValue = values[key];
    const spec = schema[key];
    const { errors: baseErrors, value: preprocessedValue } =
      validateOptionalSpec(initialValue, joinKey(keyPrefix, key), values, spec);
    if (baseErrors.length > 0) {
      errors.push(...baseErrors);
    } else {
      if (preprocessedValue !== null && preprocessedValue !== undefined) {
        const { errors: valueErrors, value: finalValue } = validateValue(
          preprocessedValue,
          joinKey(keyPrefix, key),
          spec,
        );
        result[key] = finalValue;
        errors.push(...valueErrors);
      }
    }
  }
  return {
    errors,
    value: result as ReturnType,
  };
}
function validateOptionalSpec(
  value: any,
  key: string,
  values: any,
  spec: OptionalSpec,
): ValidationReturn {
  let processedValue = value;
  const errors: SchemaValidationExceptionDetail[] = [];
  if ((value === undefined || value === null) && !spec.optional) {
    if (spec.defaultValue) {
      if (typeof spec.defaultValue === 'function') {
        processedValue = spec.defaultValue(value, values);
      } else {
        processedValue = spec.defaultValue;
      }
    } else {
      errors.push({
        type: 'required',
        key,
        value,
      });
    }
  }
  return {
    errors,
    value: processedValue,
  };
}

function validateValue(value: any, key: string, spec: Specs) {
  switch (spec.type) {
    case 'boolean':
      return validateBoolean(value, key, spec);
    case 'number':
      return validateNumber(value, key, spec);
    case 'string':
      return validateString(value, key, spec);
    case 'dateString':
      return validateDateString(value, key, spec);
    case 'object':
      return validateObject(value, key, spec);
    case 'enum':
      return validateEnum(value, key, spec);

    // array
    case 'booleans':
      return genericValidateArray(validateBoolean, value, key, spec);
    case 'numbers':
      return genericValidateArray(validateNumber, value, key, spec);
    case 'strings':
      return genericValidateArray(validateString, value, key, spec);
    case 'dateStrings':
      return genericValidateArray(validateDateString, value, key, spec);
    case 'objects':
      return genericValidateArray(validateObject, value, key, spec);
    case 'enums':
      return genericValidateArray(validateEnum, value, key, spec);
  }
}

function genericValidateArray<TSpecs extends Specs, TReturnType>(
  validator: ValidatorFunction<TSpecs, TReturnType>,
  value: any[],
  key: string,
  spec: TSpecs,
): ValidationReturn<TReturnType[]> {
  const errors: SchemaValidationExceptionDetail[] = [];
  const values: TReturnType[] = [];
  for (const index in value) {
    const v = value[index];
    const result = validator(v, joinKey(key, index), spec);
    errors.push(...result.errors);
    values.push(result.value);
  }
  return {
    errors,
    value: values,
  };
}

function validateBoolean(
  value: any,
  key: string,
  spec: BooleanSpecOptions,
): ValidationReturn {
  const errors: SchemaValidationExceptionDetail[] = [];
  if (typeof value !== 'boolean') {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: typeof value,
      expected: 'boolean',
    });
  }
  return {
    errors,
    value: value as boolean,
  };
}

function validateNumber(
  value: any,
  key: string,
  spec: NumberSpecOptions,
): ValidationReturn {
  const errors: SchemaValidationExceptionDetail[] = [];
  if (typeof value !== 'number') {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: typeof value,
      expected: 'number',
    });
  }
  if (spec.min !== undefined && value < spec.min) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
    });
  }
  if (spec.max !== undefined && value > spec.max) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
    });
  }
  return {
    errors,
    value: value as number,
  };
}

function validateString(
  value: any,
  key: string,
  spec: StringSpecOptions,
): ValidationReturn {
  const errors: SchemaValidationExceptionDetail[] = [];
  if (typeof value !== 'string') {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: typeof value,
      expected: 'string',
    });
  }
  if (spec.minLength !== undefined && value.length < spec.minLength) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
    });
  }
  if (spec.maxLength !== undefined && value.length > spec.maxLength) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
    });
  }
  return {
    errors,
    value: value as string,
  };
}

function validateDateString(
  value: any,
  key: string,
  spec: DateStringSpecOptions,
) {
  const errors: SchemaValidationExceptionDetail[] = [];
  if (typeof value !== 'string') {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: typeof value,
      expected: 'dateString',
    });
  } else if (!dateStringUtil.isValid(value)) {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: 'string',
      expected: 'dateString',
    });
  }
  if (spec.min && dayjs(value).isBefore(spec.min)) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
    });
  }
  if (spec.max && dayjs(value).isAfter(spec.max)) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
    });
  }
  return {
    errors,
    value: value as DateString,
  };
}

function validateObject(
  value: any,
  key: string,
  spec: ObjectSpecOptions,
): ValidationReturn {
  const errors: SchemaValidationExceptionDetail[] = [];
  if (typeof value !== 'object') {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: typeof value,
      expected: 'object',
    });
  }
  const { errors: validationErrors, value: projectedValue } = validateSchema(
    value,
    spec.spec,
    key,
  );
  errors.push(...validationErrors);
  return {
    errors,
    value: projectedValue,
  };
}

function validateEnum<TEnum extends string>(
  value: any,
  key: string,
  spec: EnumSpecOptions<TEnum>,
): ValidationReturn {
  const errors: SchemaValidationExceptionDetail[] = [];
  if (typeof value !== 'string') {
    errors.push({
      type: 'invalidType',
      key,
      value,
      actual: typeof value,
      expected: 'string',
    });
  }
  if (!spec.values.includes(value)) {
    errors.push({
      type: 'invalidValue',
      key,
      value,
      expected: spec.values,
    });
  }
  return {
    errors,
    value: value as string,
  };
}
