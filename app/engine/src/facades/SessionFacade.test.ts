import {
  UserNotFoundException,
  InvalidCredentialException,
} from "~/exceptions";
import { SessionFacade } from "~/facades/SessionFacade";
import { User } from "~/models";
import { JwtService } from "~/services";
import { verifyPassword } from "~/utils";

jest.mock("~/models", () => ({
  User: {
    findOne: jest.fn(),
    findByPk: jest.fn(),
  },
}));

jest.mock("~/utils", () => ({
  verifyPassword: jest.fn(),
}));

jest.mock("~/services", () => ({
  JwtService: {
    signToken: jest.fn(),
  },
}));

describe("SessionFacade", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("emailLogin", () => {
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
      const mockUser = {
        email: "test@example.com",
        password: "hashedPassword",
      };
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (verifyPassword as jest.Mock).mockResolvedValue(false); // Password mismatch

      // Act & Assert
      await expect(
        SessionFacade.emailLogin("test@example.com", "wrongPassword")
      ).rejects.toThrow(InvalidCredentialException);
    });

    it("should return a token if email and password are valid", async () => {
      // Arrange
      const mockUser = {
        email: "test@example.com",
        password: "hashedPassword",
      };
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
      expect(result).toEqual({ sessionToken: mockToken });
    });
  });
});
