import { UserUpdateAttributes } from "@app/common";
import { UserNotFoundException } from "~/exceptions";
import { UserFacade } from "~/facades/UserFacade";
import { User } from "~/models";
import { userFixtures } from "~test/fixtures/userFixtures";
import { checkStrayValues } from "~test/utils/checkStrayValues";
import { idGenerator } from "~test/utils/idGenerator";
import { initializeDatabase } from "~test/utils/initializeDatabase";
import { injectStrayValues } from "~test/utils/injectStrayValues";
import { resetData } from "~test/utils/resetData";

describe("UserFacade", () => {
  let findByPkSpy = jest.spyOn(User, "findByPk");
  beforeAll(async () => {
    initializeDatabase();
  });
  beforeEach(async () => {
    await resetData();
    await userFixtures();
    findByPkSpy.mockClear();
  });

  describe("findById", () => {
    it("should return the user object if the user is found", async () => {
      const userId = idGenerator.user(1);
      const result = await UserFacade.findById(userId);
      const user = await User.findByPk(userId);
      expect(result).toEqual(user);
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
    });

    it("should throw UserNotFoundException if the user is not found", async () => {
      const userId = idGenerator.user(99);
      const findByPkSpy = jest.spyOn(User, "findByPk");
      await expect(UserFacade.findById(userId)).rejects.toThrow(
        UserNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe("update", () => {
    it("should update user info and return the updated user", async () => {
      const userId = idGenerator.user(1);
      const updateData: UserUpdateAttributes = { name: "New Name" };
      const result = await UserFacade.update(userId, updateData);
      const updatedUser = await User.findByPk(userId);

      expect(result).toEqual(updatedUser);
      expect(result.name).toStrictEqual(updatedUser?.name);
      expect(User.findByPk).toHaveBeenCalledWith(userId);
    });
    it("should update user info and return the updated user and ignore stray values", async () => {
      const userId = idGenerator.user(1);
      const updateData: UserUpdateAttributes = {
        name: "New Name",
      };

      const result = await UserFacade.update(
        userId,
        injectStrayValues(updateData)
      );
      const updatedUser = await User.findByPk(userId);

      expect(result).toEqual(updatedUser);
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
      checkStrayValues(updatedUser);
    });

    it("should throw UserNotFoundException if the user is not found", async () => {
      const userId = idGenerator.user(99);

      await expect(
        UserFacade.update(userId, { name: "New Name" })
      ).rejects.toThrow(UserNotFoundException);
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
    });
  });
});
