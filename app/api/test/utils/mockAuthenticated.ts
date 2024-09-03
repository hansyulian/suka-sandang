import { JwtService, SessionFacade, User, UserAttributes } from "@app/engine";
export function mockAuthenticated() {
  (JwtService.verifyToken as jest.Mock).mockResolvedValueOnce({
    id: "mock-id",
    email: "mock@email.com",
  });
  const mockUser: UserAttributes = {
    id: "mock-id",
    email: "mock@email.com",
    name: "name",
    password: "password",
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  (SessionFacade.getUserInfo as jest.Mock).mockResolvedValueOnce(mockUser);
  return mockUser;
}
