import { UserUpdateAttributes } from "@app/common";
import { UserNotFoundException } from "~/exceptions";
import { FacadeBase } from "~/facades/FacadeBase";
import { User } from "~/models";

export class UserFacade extends FacadeBase {
  async findById(id: string) {
    const user = await User.findByPk(id);
    if (!user) {
      throw new UserNotFoundException({ id });
    }
    return user;
  }

  async update(id: string, data: UserUpdateAttributes) {
    const { name } = data;
    const user = await this.findById(id);
    const updatePayload = {
      name,
    };
    const result = await user.update(updatePayload);
    return result;
  }
}

// export const UserFacade = {
//   findById,
//   update,
// };

// async function findById(id: string) {
//   const user = await User.findByPk(id);
//   if (!user) {
//     throw new UserNotFoundException({ id });
//   }
//   return user;
// }

// async function update(id: string, data: UserUpdateAttributes) {
//   const { name } = data;
//   const user = await findById(id);
//   const updatePayload = {
//     name,
//   };
//   const result = await user.update(updatePayload);
//   return result;
// }
