import { apiContractSchema, InferApiContract } from "@hyulian/api-contract";

import { generateMockExpressRequest } from "../testUtil.test";
import { routeContract } from "./routeContract";

describe("@base/atlas.routeContract", () => {
  it("should be able to generate contracted route correctly for paginated array", async () => {
    const testContractSpec = apiContractSchema({
      method: "get",
      path: "",
      params: {
        param1: { type: "string" },
      },
      query: {
        query1: { type: "string" },
      },
      responseType: "paginatedArray",
      model: {
        name: { type: "string" },
        email: { type: "string" },
        status: { type: "string" },
      },
    });
    const testContract: InferApiContract<typeof testContractSpec> = {
      response: {
        records: [
          {
            email: "email",
            name: "name",
            status: "status",
          },
        ],
        pagination: {
          count: 1,
        },
      },
      model: {
        email: "email",
        name: "name",
        status: "status",
      },
      params: {
        param1: "param1",
      },
      query: {
        query1: "123",
      },
    };
    const wrappedRoute = routeContract(
      testContractSpec,
      async ({ locals, params, body }) => {
        expect(params.param1).toStrictEqual("param1");
        return {
          records: [
            {
              name: "name",
              email: "email",
              status: "status",
            },
          ],
          pagination: {
            count: 10,
          },
        };
      }
    );
    const [mockRequest, mockResponse, mockNext] = generateMockExpressRequest({
      params: {
        param1: "param1",
      },
      query: {
        query1: "123",
      },
      method: "get",
      body: {
        body1: 123,
      },
    });
    await wrappedRoute(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      records: [
        {
          name: "name",
          email: "email",
          status: "status",
        },
      ],
      pagination: {
        count: 10,
      },
    });
  });
  it("should be able to generate contracted route correctly for object", async () => {
    const testContractSpec = apiContractSchema({
      method: "get",
      path: "",
      params: {
        param1: { type: "string" },
      },
      query: {
        query1: { type: "string" },
      },
      responseType: "object",
      model: {
        name: { type: "string" },
        email: { type: "string" },
        status: { type: "string" },
      },
    });
    const testContract: InferApiContract<typeof testContractSpec> = {
      response: {
        email: "email",
        name: "name",
        status: "status",
      },
      model: {
        email: "email",
        name: "name",
        status: "status",
      },
      params: {
        param1: "param1",
      },
      query: {
        query1: "123",
      },
    };
    const wrappedRoute = routeContract(
      testContractSpec,
      async ({ locals, params, body }) => {
        expect(params.param1).toStrictEqual("param1");
        return {
          name: "name",
          email: "email",
          status: "status",
        };
      }
    );
    const [mockRequest, mockResponse, mockNext] = generateMockExpressRequest({
      params: {
        param1: "param1",
      },
      query: {
        query1: "123",
      },
      method: "get",
      body: {
        body1: 123,
      },
    });
    await wrappedRoute(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      name: "name",
      email: "email",
      status: "status",
    });
  });
  it("should be able to generate contracted route correctly for array", async () => {
    const testContractSpec = apiContractSchema({
      method: "get",
      path: "",
      params: {
        param1: { type: "string" },
      },
      query: {
        query1: { type: "string" },
      },
      responseType: "array",
      model: {
        name: { type: "string" },
        email: { type: "string" },
        status: { type: "string" },
      },
    });
    const testContract: InferApiContract<typeof testContractSpec> = {
      response: {
        records: [
          {
            email: "email",
            name: "name",
            status: "status",
          },
        ],
      },
      model: {
        email: "email",
        name: "name",
        status: "status",
      },
      params: {
        param1: "param1",
      },
      query: {
        query1: "123",
      },
    };
    const wrappedRoute = routeContract(
      testContractSpec,
      async ({ locals, params, body }) => {
        expect(params.param1).toStrictEqual("param1");
        return {
          records: [
            {
              name: "name",
              email: "email",
              status: "status",
            },
          ],
        };
      }
    );
    const [mockRequest, mockResponse, mockNext] = generateMockExpressRequest({
      params: {
        param1: "param1",
      },
      query: {
        query1: "123",
      },
      method: "get",
      body: {
        body1: 123,
      },
    });
    await wrappedRoute(mockRequest, mockResponse, mockNext);
    expect(mockNext).toHaveBeenCalledTimes(0);
    expect(mockResponse.status).toHaveBeenCalledTimes(1);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledWith({
      records: [
        {
          name: "name",
          email: "email",
          status: "status",
        },
      ],
    });
  });
});
