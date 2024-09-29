import { TruncateOptions } from "sequelize";
import { Enum, Material, User } from "~/models";

export async function resetData() {
  const config: TruncateOptions = {
    force: true,
  };
  await Promise.all([
    User.truncate(config),
    Enum.truncate(config),
    Material.truncate(config),
  ]);
}
