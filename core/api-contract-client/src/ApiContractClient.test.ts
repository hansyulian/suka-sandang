import axios from "axios";
import {
  ApiContractClient,
  ApiContractClientOptions,
} from "./ApiContractClient";
import { ApiContractMethod } from "@hyulian/api-contract";
import { stringRender } from "@hyulian/common";

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock("@hyulian/common", () => ({
  stringRender: jest.fn(),
}));

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

  it("should make a request with the correct parameters", async () => {
    const mockResponse = { data: { success: true } };
    mockedAxios.request.mockResolvedValueOnce(mockResponse);

    const requestOptions = {
      path: "/api/resource/:id",
      params: { id: 123 },
      method: "GET" as ApiContractMethod,
      query: { search: "test" },
    };

    (stringRender as jest.Mock).mockReturnValueOnce("/api/resource/123");

    const response = await client.request(requestOptions);

    expect(stringRender).toHaveBeenCalledWith("/api/resource/:id", { id: 123 });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      baseURL: baseUrl,
      url: "/api/resource/123",
      method: "GET",
      params: { search: "test" },
      data: undefined,
    });
    expect(response).toEqual(mockResponse.data);
  });

  it("should include the request body if provided", async () => {
    const mockResponse = { data: { success: true } };
    mockedAxios.request.mockResolvedValueOnce(mockResponse);

    const requestOptions = {
      path: "/api/resource/:id",
      params: { id: 123 },
      method: "POST" as ApiContractMethod,
      body: { name: "New Resource" },
    };

    (stringRender as jest.Mock).mockReturnValueOnce("/api/resource/123");

    const response = await client.request(requestOptions);

    expect(stringRender).toHaveBeenCalledWith("/api/resource/:id", { id: 123 });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      baseURL: baseUrl,
      url: "/api/resource/123",
      method: "POST",
      data: { name: "New Resource" },
      params: undefined,
    });
    expect(response).toEqual(mockResponse.data);
  });

  it("should handle errors correctly", async () => {
    const mockError = new Error("Request failed");
    mockedAxios.request.mockRejectedValueOnce(mockError);

    const requestOptions = {
      path: "/api/resource/:id",
      params: { id: 123 },
      method: "GET" as ApiContractMethod,
    };

    (stringRender as jest.Mock).mockReturnValueOnce("/api/resource/123");

    await expect(client.request(requestOptions)).rejects.toThrow(
      "Request failed"
    );

    expect(stringRender).toHaveBeenCalledWith("/api/resource/:id", { id: 123 });
    expect(mockedAxios.request).toHaveBeenCalledWith({
      baseURL: baseUrl,
      url: "/api/resource/123",
      method: "GET",
      data: undefined,
      params: undefined,
    });
  });
});
