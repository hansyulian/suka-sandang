import { Request, Response } from "express";

import { middlewareWrapper } from "./middlewareWrapper";

describe("@hyulian/common.middlewareWrapper", () => {
  it("should wrap middleware correctly for request", async () => {
    const mockRequest: Request = {} as Request;
    const mockResponse: Response = {} as Response;
    // Mock GET request
    mockRequest.method = "get";
    mockRequest.query = { search: "xyz" };
    mockRequest.params = { id: "123" };
    const next = jest.fn();
    // Call the function
    const fn = middlewareWrapper(async (context) => {
      context.locals = {
        data: context.body,
      };
    });
    await fn(mockRequest, mockResponse, next);
    // Assert the result
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(mockResponse.locals).toEqual({
      data: mockRequest.body,
    });
  });

  it("should handle error correctly", async () => {
    const mockRequest: Request = {} as Request;
    const mockResponse: Response = {} as Response;
    mockRequest.method = "post";
    mockRequest.body = { name: "John" };
    mockRequest.params = { id: "123" };

    // Call the function
    const next = jest.fn();
    const sampleError = new Error("testing");
    const fn = middlewareWrapper(async (context) => {
      throw sampleError;
    });
    await fn(mockRequest, mockResponse, next);

    // Assert the result
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(sampleError);
    expect(mockResponse.locals).toEqual({});
  });

  // Add more test cases as needed for other scenarios
});
