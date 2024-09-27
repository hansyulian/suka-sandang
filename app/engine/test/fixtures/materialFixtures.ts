import { pad } from "@hyulian/common";
import { Material } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function materialFixtures() {
  const promises = [];
  for (let i = 0; i < 50; i += 1) {
    promises.push(
      Material.create({
        id: idGenerator.material(i),
        code: `material-${pad(i, 2, { char: "0" })}`,
        name: `Material ${pad(i, 2, { char: "0" })}`,
        status: "active",
      })
    );
  }
  await Material.create({
    id: idGenerator.material(100),
    code: "deleted-material-test",
    name: "Deleted material Test",
    status: "deleted",
    deletedAt: new Date(),
  });
  await Promise.all(promises);
}
