import { UserUpdateAttributes } from "@app/common";
import { Engine } from "~/Engine";
import { UserNotFoundException } from "~/exceptions";
import { User } from "~/models";
import { userFixtures } from "~test/fixtures/userFixtures";
import { checkStrayValues } from "~test/utils/checkStrayValues";
import { idGenerator } from "~test/utils/idGenerator";
import { injectStrayValues } from "~test/utils/injectStrayValues";
import { resetData } from "~test/utils/resetData";

describe("UserFacade", () => {
  const engine = new Engine();
  let findByPkSpy = jest.spyOn(User, "findByPk");
  beforeEach(async () => {
    await resetData();
    await userFixtures();
    findByPkSpy.mockClear();
  });

  describe("findById", () => {
    it("should return the user object if the user is found", async () => {
      const userId = idGenerator.user(1);
      const result = await engine.user.findById(userId);
      const user = await User.findByPk(userId);
      expect(result).toEqual(user);
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
    });

    it("should throw UserNotFoundException if the user is not found", async () => {
      const userId = idGenerator.user(99);
      const findByPkSpy = jest.spyOn(User, "findByPk");
      await expect(engine.user.findById(userId)).rejects.toThrow(
        UserNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
    });
  });

  describe("update", () => {
    it("should update user info and return the updated user", async () => {
      const userId = idGenerator.user(1);
      const updateData: UserUpdateAttributes = { name: "New Name" };
      const result = await engine.user.update(userId, updateData);
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

      const result = await engine.user.update(
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
        engine.user.update(userId, { name: "New Name" })
      ).rejects.toThrow(UserNotFoundException);
      expect(findByPkSpy).toHaveBeenCalledWith(userId);
    });
  });
});
