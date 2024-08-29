import axios from "axios";

import { ApiContractMethod } from "@hyulian/api-contract";
import { stringRender } from "@hyulian/common";

export type ApiContractClientOptions = {
  baseUrl: string;
};

type RequestOptions = {
  path: string;
  params: Record<string, string | number>;
  method: ApiContractMethod;
  query?: Record<string, string | number>;
  body?: any;
};

export class ApiContractClient {
  public options: ApiContractClientOptions;

  public constructor(options: ApiContractClientOptions) {
    this.options = options;
  }

  public async request<Response = any>(options: RequestOptions) {
    const { baseUrl } = this.options;
    const { path, params, method, body, query, ...rest } = options;
    const url = stringRender(path, params);

    const result = await axios<Response>({
      baseURL: baseUrl,
      url,
      method,
      data: body,
      params: query,
      ...rest,
    });
    return result.data;
  }
}
