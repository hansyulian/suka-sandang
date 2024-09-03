import { JwtService, SessionFacade, UserAttributes } from "@app/engine";
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
    const user: UserAttributes = {
      id: "mock-id",
      email: "test@email.com",
      name: "name",
      password: "password",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (SessionFacade.getUserInfo as jest.Mock).mockResolvedValueOnce(user);
    const testData = generateMiddlewareTestData();
    testData.request.cookies[appConfig.jwtCookieKey] = "mock-jwt";
    await authenticationMiddleware(testData);
    expect(testData.response.locals.user).toEqual(user);
  });
  it("should throw unauthorized if there aren't any authorization used", async () => {
    (JwtService.verifyToken as jest.Mock).mockResolvedValueOnce({
      id: "mock-id",
    });
    const user: UserAttributes = {
      id: "mock-id",
      email: "test@email.com",
      name: "name",
      password: "password",
      status: "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    (SessionFacade.getUserInfo as jest.Mock).mockResolvedValueOnce(user);

    const testData = generateMiddlewareTestData();

    expect(authenticationMiddleware(testData)).rejects.toThrow(
      new UnauthorizedException()
    );
  });
});
