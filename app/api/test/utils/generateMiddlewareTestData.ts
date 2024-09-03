import {
  generateMockExpressRequest,
  RequestContext,
} from "@hyulian/express-api-contract";

export function generateMiddlewareTestData<
  TParams extends {} = any,
  TQuery extends {} | undefined = any,
  TBody extends {} | undefined = any
>(
  context?: Partial<RequestContext<TParams, TQuery, TBody>>
): RequestContext<TParams, TQuery, TBody> {
  const [mockRequest, mockResponse] = generateMockExpressRequest();
  return {
    body: {} as any,
    locals: mockResponse.locals as any,
    params: {} as any,
    query: {} as any,
    request: mockRequest,
    response: mockResponse,
    ...context,
  };
}
