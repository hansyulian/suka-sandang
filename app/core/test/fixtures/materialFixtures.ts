import { pad } from "@hyulian/common";
import { Material, MaterialSequelizeCreationAttributes } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function materialFixtures() {
  const params: MaterialSequelizeCreationAttributes[] = [];
  for (let i = 0; i < 50; i += 1) {
    params.push({
      id: idGenerator.material(i),
      code: `material-${pad(i, 2, { char: "0" })}`,
      name: `Material ${pad(i, 2, { char: "0" })}`,
      status: i % 10 === 0 ? "draft" : "active",
    });
  }
  await Material.bulkCreate(params, { individualHooks: true });
  const material = await Material.create({
    id: idGenerator.material(100),
    code: "deleted-material-test",
    name: "Deleted material Test",
    status: "deleted",
  });
  await material.destroy();
}
