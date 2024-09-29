import { pad } from "@hyulian/common";
const width = 2;
export const idGenerator = {
  user,
  enum: enumValue,
  material,
};

("00000000-0000-4000-8000-000000000000");

const entityKeys = ["user", "enum", "material"] as const;
type EntityKey = (typeof entityKeys)[number];
const entityKeyIndex: Record<EntityKey, number> = {} as any;
entityKeys.forEach((value: EntityKey, index) => {
  entityKeyIndex[value] = index;
});

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
