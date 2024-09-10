import { UserAttributes } from "@app/common";
import { JwtService, UserFacade } from "@app/engine";
export const mockAuthenticatedUser: UserAttributes = {
  id: "mock-id",
  email: "mock@email.com",
  name: "name",
  password: "password",
  status: "active",
  createdAt: new Date(),
  updatedAt: new Date(),
};
export function mockAuthenticated() {
  (JwtService.verifyToken as jest.Mock).mockResolvedValueOnce({
    id: "mock-id",
    email: "mock@email.com",
  });
  const mockUser = {
    ...mockAuthenticatedUser,
  };
  (UserFacade.findById as jest.Mock).mockResolvedValueOnce(mockUser);
  return mockUser;
}
