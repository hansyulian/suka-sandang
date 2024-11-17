import { Request, Response } from "express";

export type GenerateMockExpressRequest = {
  params?: Record<string, string>;
  body?: any;
  query?: Record<string, string>;
  method?: string;
};

type RequestMock = Request;
type ResponseMock = Response & {
  status: jest.Mock<any, any, any>;
  json: jest.Mock<any, any, any>;
};
type NextFunctionMock = jest.Mock<any, any, any>;

export function generateMockExpressRequest(
  options: GenerateMockExpressRequest = {}
): [RequestMock, ResponseMock, NextFunctionMock] {
  const mockRequest = {} as RequestMock;
  mockRequest.body = options.body || {};
  mockRequest.params = options.params || {};
  mockRequest.query = options.query || {};
  mockRequest.method = options.method || "get";
  mockRequest.cookies = {};
  mockRequest.headers = {};
  const jsonFn = jest.fn();
  const statusFn = jest.fn().mockReturnValue({ json: jsonFn });
  const mockResponse = {} as ResponseMock;
  mockResponse.status = statusFn;
  mockResponse.json = jsonFn;
  mockResponse.locals = {};
  const mockNext = jest.fn();
  mockRequest._atlasContext = {
    body: mockRequest.body,
    locals: mockResponse.locals,
    params: mockRequest.params,
    query: mockRequest.query,
    request: mockRequest as any,
    response: mockResponse as any,
  };
  return [mockRequest, mockResponse, mockNext];
}
