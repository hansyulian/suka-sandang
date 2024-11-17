import { UserUpdateAttributes } from "@app/common";
import { UserNotFoundException } from "~/exceptions";
import { EngineBase } from "~/engine/EngineBase";
import { User } from "~/models";

export class UserEngine extends EngineBase {
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
