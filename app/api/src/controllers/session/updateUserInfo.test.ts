import { UserFacade } from "@app/engine";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";
import { mockAuthenticatedUser } from "~test/utils/mockAuthenticated";

describe("Controller: updateUserInfo", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().put("/session/me");
  });
  it("should call UserFacade.update", async () => {
    (UserFacade.update as jest.Mock).mockResolvedValueOnce({
      ...mockAuthenticatedUser,
      name: "updated-name",
    });
    const response = await apiTest
      .withAuthentication()
      .put("/session/me")
      .send(
        injectStrayValues({
          name: "updated-name",
          email: "update-email@email.com",
          password: "new-password",
          status: "suspended",
        })
      );
    expect(UserFacade.update).toHaveBeenCalledWith(mockAuthenticatedUser.id, {
      name: "updated-name",
    });
    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body).toEqual({
      name: "updated-name",
      email: mockAuthenticatedUser.email,
      status: mockAuthenticatedUser.status,
    });
    checkStrayValues(body);
  });
});