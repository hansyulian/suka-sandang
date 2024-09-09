import { appConfig } from "~/config";
import { apiTest } from "~test/utils";

describe("Controller: logout", () => {
  it("should clear the session token cookie", async () => {
    const response = await apiTest
      .withoutAuthentication()
      .post("/session/logout")
      .send();

    const { status, headers, body } = response;
    const cookies = headers["set-cookie"] as unknown as string[];

    // Check the status code is 200
    expect(status).toStrictEqual(200);

    // Ensure cookies are set
    expect(cookies).toBeDefined();

    // Find the JWT cookie
    const authCookie = cookies.find((cookie) =>
      cookie.startsWith(appConfig.jwtCookieKey)
    );

    // Ensure the cookie exists
    expect(authCookie).toBeDefined();

    // Check that the cookie is cleared
    expect(authCookie?.includes("Max-Age=0")).toStrictEqual(true);

    // Check the body for the success response
    expect(body).toEqual({
      status: "success",
    });
  });
});
