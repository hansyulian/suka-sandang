import { Enum, EnumSequelizeCreationAttributes } from "~/models/Enum";
import { idGenerator } from "~test/utils/idGenerator";

export async function enumFixtures() {
  const params: EnumSequelizeCreationAttributes[] = [];
  for (let i = 0; i < 10; i += 1) {
    params.push({
      id: idGenerator.enum(i),
      group: "group-0",
      value: `group-0-value-${i}`,
      label: `group-0-label-${i}`,
    });
    params.push({
      id: idGenerator.enum(i + 10),
      group: "group-1",
      value: `group-1-value-${i}`,
      label: `group-1-label-${i}`,
    });
    params.push({
      id: idGenerator.enum(i + 20),
      group: "group-2",
      value: `group-2-value-${i}`,
      label: `group-2-label-${i}`,
    });
  }
  await Enum.bulkCreate(params, { individualHooks: true });
}
