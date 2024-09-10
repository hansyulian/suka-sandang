import { UserUpdateAttributes } from "@app/common";
import { UserNotFoundException } from "~/exceptions";
import { User } from "~/models";

export const UserFacade = {
  findById,
  update,
};

async function findById(id: string) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new UserNotFoundException({ id });
  }
  return user;
}

async function update(id: string, data: UserUpdateAttributes) {
  const { name } = data;
  const user = await findById(id);
  const updatePayload = {
    name,
  };
  const result = await user.update(updatePayload);
  return result;
}
