import { SessionFacade } from "@app/engine";
import { appConfig } from "~/config";
import { apiTest, injectStrayValues, schemaValidationBody } from "~test/utils";

describe("Controller: emailLogin", () => {
  it("should call SessionFacade.emailLogin function with required parameters", async () => {
    SessionFacade.prototype.emailLogin = jest.fn().mockResolvedValueOnce({
      sessionToken: "mock-session-token",
    });
    const payload = {
      email: "email@test.com",
      password: "password",
    };
    const response = await apiTest
      .withoutAuthentication()
      .post("/session/login")
      .send(injectStrayValues(payload));
    const { body, status, headers } = response;
    const cookies = headers["set-cookie"] as unknown as string[];
    expect(status).toStrictEqual(200);
    expect(cookies).toBeDefined();
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith(appConfig.jwt.cookieKey)
    );
    expect(authCookie).toBeDefined();
    expect(authCookie?.includes("mock-session-token")).toStrictEqual(true);
    expect(body).toEqual({
      sessionToken: "mock-session-token",
    });
  });
  it("should be error when email or password is empty", async () => {
    SessionFacade.prototype.emailLogin = jest.fn().mockResolvedValueOnce({
      sessionToken: "mock-session-token",
    });
    const payload = {};
    const response = await apiTest
      .withoutAuthentication()
      .post("/session/login")
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(500);

    expect(body).toEqual(
      schemaValidationBody([
        {
          type: "required",
          key: "body.email",
        },
        {
          type: "required",
          key: "body.password",
        },
      ])
    );
  });
  it("email must be string and password must be string", async () => {
    SessionFacade.prototype.emailLogin = jest.fn().mockResolvedValueOnce({
      sessionToken: "mock-session-token",
    });
    const payload = {
      email: 4215125124,
      password: true,
    };
    const response = await apiTest
      .withoutAuthentication()
      .post("/session/login")
      .send(injectStrayValues(payload));
    const { body, status } = response;
    expect(status).toStrictEqual(500);

    expect(body).toEqual(
      schemaValidationBody([
        {
          type: "invalidType",
          key: "body.email",
          actual: "number",
          expected: "string",
          value: 4215125124,
        },
        {
          type: "invalidType",
          key: "body.password",
          actual: "boolean",
          expected: "string",
          value: true,
        },
      ])
    );
  });
});
