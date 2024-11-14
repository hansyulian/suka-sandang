import { pad, valueIndex } from "@hyulian/common";
const width = 2;
export const idGenerator = {
  user,
  enum: enumValue,
  material,
  supplier,
  customer,
  purchaseOrder,
  purchaseOrderItem,
  inventory,
  inventoryFlow,
};

const entityKeys = [
  "user",
  "enum",
  "material",
  "supplier",
  "customer",
  "purchaseOrder",
  "purchaseOrderItem",
  "inventory",
  "inventoryFlow",
] as const;
type EntityKey = (typeof entityKeys)[number];
const entityKeyIndex = valueIndex(
  entityKeys as unknown as string[]
) as unknown as Record<EntityKey, number>;
function generator(entityKey: EntityKey, values: number[]) {
  const entityId = entityKeyIndex[entityKey];
  const idValue = values
    .map((value) => pad(value, width, { char: "0" }))
    .join("");
  return `00000000-${pad(entityId, 4, { char: "0" })}-4000-8000-${pad(
    idValue,
    12,
    { char: "0" }
  )}`;
}

function user(id: number) {
  return generator("user", [id]);
}

function material(id: number) {
  return generator("material", [id]);
}

function enumValue(id: number) {
  return generator("enum", [id]);
}

function supplier(id: number) {
  return generator("supplier", [id]);
}

function customer(id: number) {
  return generator("customer", [id]);
}

function purchaseOrder(id: number) {
  return generator("purchaseOrder", [id]);
}

function purchaseOrderItem(id: number, purchaseOrderId: number) {
  return generator("purchaseOrderItem", [purchaseOrderId, id]);
}

function inventory(id: number) {
  return generator("inventory", [id]);
}

function inventoryFlow(id: number, inventoryId: number) {
  return generator("inventoryFlow", [inventoryId, id]);
}
