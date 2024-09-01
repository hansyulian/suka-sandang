import {
  UserNotFoundException,
  InvalidCredentialException,
} from "~/exceptions";
import { SessionFacade } from "~/facades/SessionFacade";
import { User, UserUpdateAttributes } from "~/models";
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
      expect(result).toEqual({ token: mockToken });
    });
  });

  describe("getUserInfo", () => {
    it("should return the user object if the user is found", async () => {
      // Arrange
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashed_password",
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await SessionFacade.getUserInfo("1");

      // Assert
      expect(result).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith("1");
    });

    it("should throw UserNotFoundException if the user is not found", async () => {
      // Arrange
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(SessionFacade.getUserInfo("1")).rejects.toThrow(
        UserNotFoundException
      );
      expect(User.findByPk).toHaveBeenCalledWith("1");
    });
  });

  describe("updateUserInfo", () => {
    it("should update user info and return the updated user", async () => {
      // Arrange
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashed_password",
        update: jest.fn().mockResolvedValue({
          id: "1",
          email: "test@example.com",
          password: "hashed_password",
          name: "New Name",
        }),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const updateData: UserUpdateAttributes = { name: "New Name" };

      // Act
      const result = await SessionFacade.updateUserInfo("1", updateData);

      // Assert
      expect(result).toEqual({
        id: "1",
        email: "test@example.com",
        password: "hashed_password",
        name: "New Name",
      });
      expect(User.findByPk).toHaveBeenCalledWith("1");
      expect(mockUser.update).toHaveBeenCalledWith({ name: "New Name" });
    });
    it("should update user info and return the updated user and ignore stray values", async () => {
      // Arrange
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashed_password",
        update: jest.fn().mockResolvedValue({
          id: "1",
          email: "test@example.com",
          password: "hashed_password",
          name: "New Name",
        }),
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      const updateData: UserUpdateAttributes = {
        name: "New Name",
      };

      // Act
      const result = await SessionFacade.updateUserInfo("1", {
        ...updateData,
        a: "stray value",
        b: "stray value",
      } as any);

      // Assert
      expect(result).toEqual({
        id: "1",
        email: "test@example.com",
        password: "hashed_password",
        name: "New Name",
      });
      expect(User.findByPk).toHaveBeenCalledWith("1");
      expect(mockUser.update).toHaveBeenCalledWith({ name: "New Name" });
    });

    it("should throw UserNotFoundException if the user is not found", async () => {
      // Arrange
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        SessionFacade.updateUserInfo("1", { name: "New Name" })
      ).rejects.toThrow(UserNotFoundException);
      expect(User.findByPk).toHaveBeenCalledWith("1");
    });
  });
});
