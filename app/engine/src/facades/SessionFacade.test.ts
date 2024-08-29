import {
  UserNotFoundException,
  InvalidCredentialException,
} from "~/exceptions";
import { SessionFacade } from "~/facades/SessionFacade";
import { User } from "~/models";
import { JwtService } from "~/services/JwtService";
import { verifyPassword } from "~/utils/verifyPassword";

jest.mock("~/models");
jest.mock("~/utils/verifyPassword");
jest.mock("~/services/JwtService");

describe("SessionFacade.emailLogin", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("should throw UserNotFoundException if user is not found", async () => {
    // Arrange
    (User.findOne as jest.Mock).mockResolvedValue(null);

    // Act & Assert
    await expect(
      SessionFacade.emailLogin("test@example.com", "password")
    ).rejects.toThrow(UserNotFoundException);
  });

  it("should throw InvalidCredentialException if password is incorrect", async () => {
    // Arrange
    const mockUser = { email: "test@example.com", password: "hashedPassword" };
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(false); // Password mismatch

    // Act & Assert
    await expect(
      SessionFacade.emailLogin("test@example.com", "wrongPassword")
    ).rejects.toThrow(InvalidCredentialException);
  });

  it("should return a token if email and password are valid", async () => {
    // Arrange
    const mockUser = { email: "test@example.com", password: "hashedPassword" };
    const mockToken = "validToken";
    (User.findOne as jest.Mock).mockResolvedValue(mockUser);
    (verifyPassword as jest.Mock).mockResolvedValue(true); // Password match
    (JwtService.signToken as jest.Mock).mockResolvedValue(mockToken);

    // Act
    const result = await SessionFacade.emailLogin(
      "test@example.com",
      "password"
    );

    // Assert
    expect(result).toEqual({ token: mockToken });
  });
});
