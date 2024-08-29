import { Schema, Specs } from '../../schema';

export type ObjectBody<TBody extends {}> = TBody;
export type ArrayBody<TBody extends {}> = TBody[];
export type BodyBase<TBody extends {}> = ObjectBody<TBody> | ArrayBody<TBody>;
export type ApiContractBodyType = 'object' | 'array';
export type InferBodyType<
  BT extends ApiContractBodyType,
  TBody extends {},
> = BT extends 'array'
  ? ArrayBody<TBody>
  : BT extends 'object'
    ? ObjectBody<TBody>
    : 'failToInferBodyType';

export type ApiContractBodySpec = Specs;
export type ApiContractBodySchema = Schema;
