import { UserAttributes } from "@app/common";
import { JwtService } from "@app/engine";
import { UnauthorizedException } from "@hyulian/express-api-contract";
import { appConfig } from "~/config";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";
import { generateMiddlewareTestData } from "~test/utils/generateMiddlewareTestData";
import { mockAuthenticated } from "~test/utils/mockAuthenticated";

describe("authenticationMidleware", () => {
  it("should be able to accept token in cookie", async () => {
    const mockUser = mockAuthenticated();
    const testData = generateMiddlewareTestData();
    testData.request.cookies[appConfig.jwtCookieKey] = "mock-jwt";
    await authenticationMiddleware(testData);
    expect(testData.response.locals.user).toEqual(mockUser);
  });
  it("should be able to accept token in header", async () => {
    (JwtService.verifyToken as jest.Mock).mockResolvedValueOnce({
      id: "mock-id",
    });
    const testData = generateMiddlewareTestData();
    const mockUser = mockAuthenticated();
    testData.request.cookies[appConfig.jwtCookieKey] = "mock-jwt";
    await authenticationMiddleware(testData);
    expect(testData.response.locals.user).toEqual(mockUser);
  });
  it("should throw unauthorized if there aren't any authorization used", async () => {
    (JwtService.verifyToken as jest.Mock).mockResolvedValueOnce({
      id: "mock-id",
    });
    mockAuthenticated();
    const testData = generateMiddlewareTestData();

    expect(authenticationMiddleware(testData)).rejects.toThrow(
      new UnauthorizedException()
    );
  });
});
