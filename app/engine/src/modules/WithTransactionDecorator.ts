import { FacadeBase } from "~/facades/FacadeBase";

export function WithTransaction(
  target: FacadeBase,
  propertyName: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    return target.withTransaction(async (transaction) => {
      originalMethod.apply(this, args);
    });
  };
}
