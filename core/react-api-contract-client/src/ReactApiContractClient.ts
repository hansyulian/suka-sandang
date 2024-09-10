import {
  InferApiContract,
  MutationContractSchema,
  QueryContractSchema,
} from "@hyulian/api-contract";
import { ApiContractClient } from "@hyulian/api-contract-client";

import {
  useMutation,
  UseMutationOptions,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";

export type ReactApiContractQueryOptions = Pick<
  UseQueryOptions,
  | "behavior"
  | "refetchInterval"
  | "refetchOnMount"
  | "refetchOnWindowFocus"
  | "refetchOnReconnect"
  | "retry"
  | "retryOnMount"
>;
export type ApiContractClientOptions = {
  baseUrl: string;
} & ReactApiContractQueryOptions;
export class ReactApiContractClient extends ApiContractClient {
  public queryOptions: ReactApiContractQueryOptions;
  public constructor(options: ApiContractClientOptions) {
    super(options);
    const {
      behavior,
      refetchInterval,
      refetchOnMount,
      refetchOnWindowFocus,
      refetchOnReconnect,
      retry,
      retryOnMount,
    } = options;
    this.queryOptions = {
      behavior,
      refetchInterval,
      refetchOnMount,
      refetchOnWindowFocus,
      refetchOnReconnect,
      retry,
      retryOnMount,
    };
  }

  public registerMutationContract<
    TMutationContractSchema extends MutationContractSchema,
  >(
    contract: TMutationContractSchema,
    options: Partial<
      UseMutationOptions<
        InferApiContract<TMutationContractSchema>["response"],
        unknown, // Error type
        InferApiContract<TMutationContractSchema>["body"]
      >
    > = {}
  ) {
    type Schema = InferApiContract<TMutationContractSchema>;
    type Params = Schema["params"];
    type Body = Schema["body"];
    type Response = Schema["response"];

    const request = async (
      params: Params,
      body: Body,
      config: any = {}
    ): Promise<Response> => {
      return this.request<Response>({
        path: contract.path,
        params,
        body,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (params: Params = {}) => {
      return useMutation<Response, unknown, Body, unknown>({
        mutationFn: (data) => request(params, data),

        ...options,
      });
    };

    return {
      request,
      useRequest,
    };
  }

  public registerQueryContract<
    TQueryContractSchema extends QueryContractSchema,
  >(
    contract: TQueryContractSchema,
    queryKey: string,
    baseOptions: Partial<
      UseQueryOptions<
        InferApiContract<TQueryContractSchema>["response"],
        unknown,
        InferApiContract<TQueryContractSchema>["response"]
      >
    > = {}
  ) {
    type Schema = InferApiContract<TQueryContractSchema>;
    type Params = Schema["params"];
    type Query = Partial<Schema["query"]>;
    type Response = Schema["response"];
    const self = this;

    const request = async (
      params: Params,
      query: Query,
      config: any = {}
    ): Promise<Response> => {
      return this.request<Response>({
        path: contract.path,
        params: params,
        query,
        ...config,
        method: contract.method,
      });
    };

    const useRequest = (
      params: Params,
      query: Query,
      options: Partial<
        UseQueryOptions<
          InferApiContract<TQueryContractSchema>["response"],
          unknown,
          InferApiContract<TQueryContractSchema>["response"]
        >
      > = {}
    ) => {
      return useQuery<Response, unknown>({
        ...(self.queryOptions as any),
        queryKey: [queryKey, { ...query, ...params }],
        queryFn: () => {
          return request(params, query);
        },
        ...baseOptions,
        ...options,
      });
    };

    return {
      request,
      useRequest,
    };
  }
}
