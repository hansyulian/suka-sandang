import { UserUpdateAttributes } from "@app/common";
import { UserNotFoundException } from "~/exceptions";
import { UserFacade } from "~/facades/UserFacade";
import { User } from "~/models";

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

describe("UserFacade", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("findById", () => {
    it("should return the user object if the user is found", async () => {
      // Arrange
      const mockUser = {
        id: "1",
        email: "test@example.com",
        password: "hashed_password",
      };
      (User.findByPk as jest.Mock).mockResolvedValue(mockUser);

      // Act
      const result = await UserFacade.findById("1");

      // Assert
      expect(result).toEqual(mockUser);
      expect(User.findByPk).toHaveBeenCalledWith("1");
    });

    it("should throw UserNotFoundException if the user is not found", async () => {
      // Arrange
      (User.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(UserFacade.findById("1")).rejects.toThrow(
        UserNotFoundException
      );
      expect(User.findByPk).toHaveBeenCalledWith("1");
    });
  });

  describe("update", () => {
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
      const result = await UserFacade.update("1", updateData);

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
      const result = await UserFacade.update("1", {
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
        UserFacade.update("1", { name: "New Name" })
      ).rejects.toThrow(UserNotFoundException);
      expect(User.findByPk).toHaveBeenCalledWith("1");
    });
  });
});
