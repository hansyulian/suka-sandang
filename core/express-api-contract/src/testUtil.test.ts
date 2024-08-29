import { Request, Response } from 'express';

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
  options: GenerateMockExpressRequest = {},
): [RequestMock, ResponseMock, NextFunctionMock] {
  const mockRequest = {} as RequestMock;
  mockRequest.body = options.body || {};
  mockRequest.params = options.params || {};
  mockRequest.query = options.query || {};
  mockRequest.method = options.method || 'get';
  const jsonFn = jest.fn();
  const statusFn = jest.fn().mockReturnValue({ json: jsonFn });
  const mockResponse = {} as ResponseMock;
  mockResponse.status = statusFn;
  mockResponse.json = jsonFn;
  const mockNext = jest.fn();
  return [mockRequest, mockResponse, mockNext];
}
