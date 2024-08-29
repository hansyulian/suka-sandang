export type ObjectResponse<Model extends {}> = Model;
export type ResponseBase<Model extends {}> =
  | ObjectResponse<Model>
  | ArrayResponse<Model>
  | PaginatedArrayResponse<Model>;

export type PaginationInfo = {
  count: number;
};

export type ArrayInfo = {};

export type ArrayResponse<Model extends {}> = {
  records: Model[];
};
export type PaginatedArrayResponse<Model extends {}> = {
  pagination: PaginationInfo;
} & ArrayResponse<Model>;

export type ApiContractResponseType = 'object' | 'array' | 'paginatedArray';

export type InferResponseType<
  RT extends ApiContractResponseType,
  Model extends {},
> = RT extends 'object'
  ? ObjectResponse<Model>
  : RT extends 'array'
    ? ArrayResponse<Model>
    : RT extends 'paginatedArray'
      ? PaginatedArrayResponse<Model>
      : 'failToInferContractResponse';
