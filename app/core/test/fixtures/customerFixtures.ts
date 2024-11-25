import { Customer, CustomerSequelizeCreationAttributes } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function customerFixtures() {
  const params: CustomerSequelizeCreationAttributes[] = [];

  for (let i = 0; i < 50; i += 1) {
    params.push({
      id: idGenerator.customer(i),
      name: `Test Customer ${i}`,
    });
  }
  await Customer.bulkCreate(params);
}
