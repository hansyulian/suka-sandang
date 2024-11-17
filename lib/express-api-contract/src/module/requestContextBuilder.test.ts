import { Request, Response } from "express";

import { requestContextBuilder } from "./requestContextBuilder";

// Mock Request and Response objects
const mockRequest: Request = {} as Request;
const mockResponse: Response = {} as Response;

describe("@hyulian/common.requestContextBuilder", () => {
  it("should build RequestContext correctly for request", () => {
    // Mock GET request
    mockRequest.method = "get";
    mockRequest.query = { search: "xyz" };
    mockRequest.params = { id: "123" };

    // Call the function
    const result = requestContextBuilder(mockRequest, mockResponse);

    // Assert the result
    expect(result.params).toEqual({ id: "123" });
    expect(result.query).toEqual({ search: "xyz" }); // payload should be the same as query for GET requests
    expect(result.request).toBe(mockRequest);
    expect(result.response).toBe(mockResponse);
  });

  it("should build RequestContext correctly for POST request", () => {
    // Mock POST request
    mockRequest.method = "post";
    mockRequest.body = { name: "John" };
    mockRequest.params = { id: "123" };

    // Call the function
    const result = requestContextBuilder(mockRequest, mockResponse);

    // Assert the result
    expect(result.params).toEqual({ id: "123" }); // params should be empty for POST requests
    expect(result.body).toEqual({ name: "John" });
    expect(result.request).toBe(mockRequest);
    expect(result.response).toBe(mockResponse);
  });

  it("should build RequestContext correctly for PUT request", () => {
    // Mock POST request
    mockRequest.method = "put";
    mockRequest.body = { name: "John" };
    mockRequest.params = { id: "123" };

    // Call the function
    const result = requestContextBuilder(mockRequest, mockResponse);

    // Assert the result
    expect(result.params).toEqual({ id: "123" }); // params should be empty for POST requests
    expect(result.body).toEqual({ name: "John" });
    expect(result.request).toBe(mockRequest);
    expect(result.response).toBe(mockResponse);
  });

  it("should build RequestContext correctly for DELETE request", () => {
    // Mock POST request
    mockRequest.method = "delete";
    mockRequest.body = { name: "John" };
    mockRequest.params = { id: "123" };

    // Call the function
    const result = requestContextBuilder(mockRequest, mockResponse);

    // Assert the result
    expect(result.params).toEqual({ id: "123" }); // params should be empty for POST requests
    expect(result.body).toEqual({ name: "John" });
    expect(result.request).toBe(mockRequest);
    expect(result.response).toBe(mockResponse);
  });

  // Add more test cases as needed for other scenarios
});
