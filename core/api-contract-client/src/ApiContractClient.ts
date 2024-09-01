import axios from "axios";

import { ApiContractMethod } from "@hyulian/api-contract";
import { stringRender } from "@hyulian/common";

export type ApiContractClientOptions = {
  baseUrl: string;
  headers?: Record<string, string>;
};

type RequestOptions = {
  path: string;
  params: Record<string, string | number>;
  method: ApiContractMethod;
  query?: Record<string, string | number>;
  headers?: Record<string, string>;
  body?: any;
};

export class ApiContractClient {
  public options: ApiContractClientOptions;

  public constructor(options: ApiContractClientOptions) {
    this.options = {
      ...options,
      headers: {
        "content-type": "application/json",
        ...options.headers,
      },
    };
  }

  public async request<Response = any>(options: RequestOptions) {
    const { baseUrl, headers: baseHeaders } = this.options;
    const { path, params, method, body, query, headers, ...rest } = options;
    const url = stringRender(path, params);
    const axiosRequestConfig = {
      baseURL: baseUrl,
      url,
      method,
      data: body,
      params: query,
      headers: {
        ...baseHeaders,
        ...headers,
      },
      ...rest,
    };
    const result = await axios.request<Response>(axiosRequestConfig);
    return result.data;
  }
}
