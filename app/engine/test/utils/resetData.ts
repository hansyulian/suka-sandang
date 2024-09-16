import { TruncateOptions } from "sequelize";
import { Material, User } from "~/models";

export async function resetData() {
  const config: TruncateOptions = {
    force: true,
  };
  await Promise.all([User.truncate(config), Material.truncate(config)]);
}
