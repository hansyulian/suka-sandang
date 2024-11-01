import axios from "axios";
import {
  ApiContractClient,
  ApiContractClientOptions,
} from "./ApiContractClient";
import { ApiContractMethod, apiContractSchema } from "@hyulian/api-contract";

describe("ApiContractClient", () => {
  let client: ApiContractClient;
  const baseUrl = "http://example.com";

  beforeEach(() => {
    const options: ApiContractClientOptions = { baseUrl };
    client = new ApiContractClient(options);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("contractRequest", () => {
    it("should make request according to the contract provided", async () => {
      const mockResponse = {
        data: { validModel: 123, someDust: "should be gone" },
      };
      const requestSpy = (axios.request = jest
        .fn()
        .mockResolvedValueOnce(mockResponse));
      const contract = apiContractSchema({
        method: "post",
        body: {
          validBody: {
            type: "number",
          },
        },
        params: {
          validParam: {
            type: "string",
          },
        },
        bodyType: "object",
        model: {
          validModel: {
            type: "string",
          },
        },
        path: "/test-path/{validParam}",
        responseType: "object",
      });
      const requestOptions = {
        params: {
          validParam: 123,
          invalidParam: "should be gone",
        } as any,
        body: {
          validBody: 123,
          invalidBody: "should be gone",
        } as any,
      };
      const response = await client.contractRequest(contract, requestOptions);
      expect(requestSpy).toHaveBeenCalledWith({
        params: undefined,
        baseURL: "http://example.com",
        data: {
          validBody: 123,
        },
        headers: {
          "content-type": "application/json",
        },
        method: "post",
        url: "/test-path/123",
      });
      expect(response).toEqual({
        validModel: "123",
      });
    });
  });

  describe("request", () => {
    it("should make a request with the correct parameters", async () => {
      const mockResponse = { data: { success: true } };
      const requestSpy = (axios.request = jest
        .fn()
        .mockResolvedValueOnce(mockResponse));

      const requestOptions = {
        path: "/api/resource/{id}",
        params: { id: 123 },
        method: "GET" as ApiContractMethod,
        query: { search: "test" },
      };

      const response = await client.request(requestOptions);

      expect(requestSpy).toHaveBeenCalledWith({
        baseURL: baseUrl,
        url: "/api/resource/123",
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        params: { search: "test" },
        data: undefined,
      });
      expect(response).toEqual(mockResponse.data);
    });

    it("should include the request body if provided", async () => {
      const mockResponse = { data: { success: true } };
      const requestSpy = (axios.request = jest
        .fn()
        .mockResolvedValueOnce(mockResponse));

      const requestOptions = {
        path: "/api/resource/{id}",
        params: { id: 123 },
        method: "POST" as ApiContractMethod,
        body: { name: "New Resource" },
      };

      const response = await client.request(requestOptions);

      expect(requestSpy).toHaveBeenCalledWith({
        baseURL: baseUrl,
        url: "/api/resource/123",
        method: "POST",
        data: { name: "New Resource" },
        headers: {
          "content-type": "application/json",
        },
        params: undefined,
      });
      expect(response).toEqual(mockResponse.data);
    });

    it("should handle errors correctly", async () => {
      const mockError = new Error("Request failed");
      const requestSpy = (axios.request = jest
        .fn()
        .mockRejectedValueOnce(mockError));

      const requestOptions = {
        path: "/api/resource/{id}",
        params: { id: 123 },
        method: "GET" as ApiContractMethod,
      };

      await expect(client.request(requestOptions)).rejects.toThrow(
        "Request failed"
      );

      expect(requestSpy).toHaveBeenCalledWith({
        baseURL: baseUrl,
        url: "/api/resource/123",
        headers: {
          "content-type": "application/json",
        },
        method: "GET",
        data: undefined,
        params: undefined,
      });
    });
  });
});
