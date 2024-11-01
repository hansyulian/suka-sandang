import { FacadeBase } from "~/facades/FacadeBase";

export function WithTransaction(
  target: FacadeBase,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    const self = this as FacadeBase;
    if (!self.transactionMutex) {
      self.transactionMutex = true;
      return new Promise(async (resolve, reject) => {
        try {
          await self.sequelize.transaction(async (transaction) => {
            try {
              const result = await originalMethod.apply(self, args);
              self.transactionMutex = false;
              resolve(result);
            } catch (err) {
              self.transactionMutex = false;
              reject(err);
              throw err;
            }
          });
        } catch (err) {
          // this catch just to prevent double throwing from the inside of the transaction rejection
        }
      });
    }
    return originalMethod.apply(self, args);
  };
}
