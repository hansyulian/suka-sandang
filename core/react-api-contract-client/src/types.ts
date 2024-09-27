import { ResponseModel } from "@hyulian/api-contract";

export type BaseReactApiContract = {
  request: (...args: any[]) => PromiseLike<any>;
};

type Depromised<T> = T extends Promise<infer X> ? X : T;
type Deundefined<T> = Exclude<T, undefined>;
export type ContractResponseModel<
  TReactApiContract extends BaseReactApiContract
> = ResponseModel<
  Deundefined<Depromised<ReturnType<TReactApiContract["request"]>>>
>;
