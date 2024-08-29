import { HttpRequestException } from "~/exceptions";

export type HttpRequestMethods = "get" | "post" | "put" | "delete";

export type HttpRequestConfig<Data extends object> = {
  method?: HttpRequestMethods;
  url: string;
  headers?: Record<string, string | number>;
  params?: Record<string, string | number>;
  data?: Data;
  retryCount?: number;
};

export async function httpRequest<
  Return extends object = any,
  Data extends object = any
>(config: HttpRequestConfig<Data>): Promise<Return> {
  const { method = "get", url, headers, params, data, retryCount = 0 } = config;

  // Build query string from params
  const queryString = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  const fullUrl = `${url}${queryString}`;

  const fetchConfig: RequestInit = {
    method,
    headers: headers as HeadersInit,
    body:
      method !== "get" && method !== "delete"
        ? JSON.stringify(data)
        : undefined,
  };

  try {
    const response = await fetch(fullUrl, fetchConfig);
    if (!response.ok) {
      throw new HttpRequestException(`HTTP error! status: ${response.status}`);
    }
    return (await response.json()) as Return;
  } catch (error: any) {
    console.error(error);
    if (retryCount > 0) {
      return httpRequest({ ...config, retryCount: retryCount - 1 });
    }
    throw new HttpRequestException(
      error.message || "An unknown error occurred"
    );
  }
}
