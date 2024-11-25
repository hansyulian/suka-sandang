import { Supplier, SupplierSequelizeCreationAttributes } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function supplierFixtures() {
  const params: SupplierSequelizeCreationAttributes[] = [];
  for (let i = 0; i < 50; i += 1) {
    params.push({ id: idGenerator.supplier(i), name: `Test Supplier ${i}` });
  }
  await Supplier.bulkCreate(params);
}
