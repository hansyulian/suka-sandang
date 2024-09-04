import { apiTest, checkStrayValues } from "~test/utils";
import { mockAuthenticatedUser } from "~test/utils/mockAuthenticated";

describe("Controller: getUserInfo", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/session/me");
  });
  it("should return the current authenticated user", async () => {
    const response = await apiTest
      .withAuthentication()
      .get("/session/me")
      .send();
    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body).toEqual({
      name: "name",
      email: mockAuthenticatedUser.email,
      status: mockAuthenticatedUser.status,
    });
    checkStrayValues(body);
  });
});
