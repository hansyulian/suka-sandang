import { Customer } from "~/models";
import { idGenerator } from "~test/utils/idGenerator";

export async function customerFixtures() {
  const promises = [];
  for (let i = 0; i < 50; i += 1) {
    promises.push(
      Customer.create({
        id: idGenerator.customer(i),
        name: `Test Customer ${i}`,
      })
    );
  }
  await Promise.all(promises);
}
