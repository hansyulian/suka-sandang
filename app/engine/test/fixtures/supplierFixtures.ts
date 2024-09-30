import { Supplier } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function supplierFixtures() {
  const promises = [];
  for (let i = 0; i < 50; i += 1) {
    promises.push(
      Supplier.create({
        id: idGenerator.supplier(i),
        name: `Test Supplier ${i}`,
      })
    );
  }
  await Promise.all(promises);
}
