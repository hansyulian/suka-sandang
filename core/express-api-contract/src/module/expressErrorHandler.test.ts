import { Request, Response } from "express";

import { Exception } from "@hyulian/common";

import { expressErrorHandler } from "./expressErrorHandler";

class SampleException extends Exception {
  public constructor(value: string, reference: string) {
    super("sample", { value }, reference);
  }
}

describe("@hyulian/common.expressErrorHandler", () => {
  it("should be able to handle Exception correctly", () => {
    const errorHandler = expressErrorHandler({});
    const sampleException = new SampleException("sample-value", "test001");
    const mockRequest = {} as Request;
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({
      json: mockJson,
    });
    const mockResponse = {} as Response;
    mockResponse.status = mockStatus;
    const mockNext = jest.fn();
    errorHandler(sampleException, mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      details: {
        value: "sample-value",
      },
      reference: "test001",
      stack: undefined,
      name: "sample",
    });
  });
  it("should be able to handle Other Error as GenericException correctly", () => {
    const errorHandler = expressErrorHandler({});
    const sampleException = new Error("this is error message");
    const mockRequest = {} as Request;
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({
      json: mockJson,
    });
    const mockResponse = {} as Response;
    mockResponse.status = mockStatus;
    const mockNext = jest.fn();
    errorHandler(sampleException, mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledTimes(1);
    expect(mockJson).toHaveBeenCalledWith({
      details: {
        message: "this is error message",
      },
      reference: undefined,
      stack: undefined,
      name: "generic",
    });
  });
  it("should be able to handle Exception correctly and show stack on debug", () => {
    const errorHandler = expressErrorHandler({ debug: true });
    const sampleException = new SampleException("sample-value", "test001");
    const mockRequest = {} as Request;
    const mockJson = jest.fn();
    const mockStatus = jest.fn().mockReturnValue({
      json: mockJson,
    });
    const mockResponse = {} as Response;
    mockResponse.status = mockStatus;
    const mockNext = jest.fn();
    errorHandler(sampleException, mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockStatus).toHaveBeenCalledTimes(1);
    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockJson).toHaveBeenCalledTimes(1);
    const lastCallParams = mockJson.mock.calls[0][0];
    expect(lastCallParams.details).toEqual({
      value: "sample-value",
    });
    expect(lastCallParams.reference).toEqual("test001");
    expect(lastCallParams.name).toEqual("sample");
    expect(lastCallParams.stack).toBeDefined();
  });
});
