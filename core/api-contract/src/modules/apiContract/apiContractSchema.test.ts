import { apiContractSchema } from "./apiContractSchema";
import {
  ApiContractBody,
  ApiContractModel,
  ApiContractParams,
  ApiContractQuery,
  ApiContractResponse,
  InferApiContract,
} from "./types/Contract";

describe("@hyulian/common.modules.projection.apiContractSchema", () => {
  it("InferApiContract should be able to handle typing correctly for undefined type as object", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "object",
      model: {
        a: { type: "string" },
      },
      params: {
        numberParam: {
          type: "number",
        },
        stringParam: {
          type: "string",
        },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: InferApiContract<typeof sampleApiContract> = {
      params: { stringParam: "123", numberParam: 123 },
      query: { d: "123" },
      response: { a: "123" },
      model: { a: "123" },
    };
    expect(true);
  });
  it("InferApiContract should be able to handle typing correctly for array type", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "array",
      model: {
        a: { type: "string" },
        anyValue: {
          type: "any",
        },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: InferApiContract<typeof sampleApiContract> = {
      params: { b: "123" },
      response: {
        records: [
          { a: "123", anyValue: "123" },
          {
            a: "2222",
            anyValue: {},
          },
        ],
      },
      model: {
        a: "123",
        anyValue: { value: "even object also acceptable for any" },
      },
      query: { d: "123" },
    };
    expect(true);
  });
  it("InferApiContract should be able to handle typing correctly for object type", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "object",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: InferApiContract<typeof sampleApiContract> = {
      params: { b: "123" },
      query: { d: "123" },
      response: { a: "123" },
      model: { a: "123" },
    };
    expect(true);
  });
  it("InferApiContract should be able to handle typing correctly for paginatedArray type", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "paginatedArray",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: InferApiContract<typeof sampleApiContract> = {
      params: { b: "123" },
      query: { d: "123" },
      response: {
        records: [{ a: "123" }],
        info: {
          count: 1,
        },
      },
      model: { a: "123" },
    };
    expect(true);
  });
  it("ApiContractModel should be able to handle typing correctly ", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "paginatedArray",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: ApiContractModel<typeof sampleApiContract> = { a: "123" };
    expect(true);
  });
  it("ApiContractBody should be able to handle typing correctly ", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "paginatedArray",
      bodyType: "object",
      body: {
        c: { type: "string" },
      },
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      method: "post",
      path: "/",
    });
    const result: ApiContractBody<typeof sampleApiContract> = { c: "123" };
    expect(true);
  });
  it("ApiContractParams should be able to handle typing correctly ", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "paginatedArray",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: ApiContractParams<typeof sampleApiContract> = { b: "123" };
    expect(true);
  });
  it("ApiContractQuery should be able to handle typing correctly ", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "paginatedArray",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: ApiContractQuery<typeof sampleApiContract> = { d: "123" };
    expect(true);
  });
  it("ApiContractResponse should be able to handle typing correctly ", () => {
    const sampleApiContract = apiContractSchema({
      responseType: "paginatedArray",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      query: {
        d: { type: "string" },
      },
      method: "get",
      path: "/",
    });
    const result: ApiContractResponse<typeof sampleApiContract> = {
      records: [{ a: "123" }],
      info: {
        count: 1,
      },
    };
    // const fail: InferApiContract<typeof sampleApiContract> = {
    //   params: { x: '123' },
    //   body: [{ c: '123' }],
    //   query: { x: '123' },
    //   response: { a: '123' },
    //   model: { ax: '123' },
    // };
    expect(true);
  });
  it("InferApiContract should be able to handle typing correctly for array body type", () => {
    const sampleApiContract = apiContractSchema({
      bodyType: "array",
      body: { c: { type: "string" } },
      responseType: "object",
      model: {
        a: { type: "string" },
      },
      params: {
        b: { type: "string" },
      },
      method: "post",
      path: "/",
    });
    type SchemaType = typeof sampleApiContract;
    type ContractType = InferApiContract<SchemaType>;
    const result: ContractType = {
      params: { b: "123" },
      body: [{ c: "123" }],
      response: { a: "123" },
      model: { a: "123" },
    };
    // const fail: ContractType = {
    //   params: { b: '123' },
    //   body: { c: '123' },
    //   query: { d: '123' },
    //   response: { a: '123' },
    //   model: { a: '123' },
    // };
    expect(true);
  });
  it("InferApiContract should be able to handle optional typing correctly for model", () => {
    const sampleApiContract = apiContractSchema({
      bodyType: "array",
      body: { c: { type: "string" } },
      responseType: "object",
      model: {
        a: { type: "string" },
        b: { type: "number", optional: true },
      },
      params: {
        b: { type: "string" },
      },
      method: "post",
      path: "/",
    });
    type SchemaType = typeof sampleApiContract;
    type ContractType = InferApiContract<SchemaType>;
    const result: ContractType = {
      params: { b: "123" },
      body: [{ c: "123" }],
      response: { a: "123", b: undefined },
      model: { a: "123", b: undefined },
    };
    // const fail: ContractType = {
    //   params: { b: '123' },
    //   body: { c: '123' },
    //   query: { d: '123' },
    //   response: { a: '123' },
    //   model: { a: '123' },
    // };
    expect(true);
  });
});
