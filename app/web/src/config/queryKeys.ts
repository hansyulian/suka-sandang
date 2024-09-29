type ConstQueryKeys<Keys extends string> = Record<Keys, string>;
function lockQueryKeys<
  TKeys extends string,
  TConstQueryKeys extends ConstQueryKeys<TKeys>
>(queryKeys: TConstQueryKeys): TConstQueryKeys {
  return queryKeys;
}

export const queryKeys = lockQueryKeys({
  serverInfo: "serverInfo",
  userInfo: "userInfo",
  material: "material",
  enum: "enum",
} as const);

export type QueryKeys = typeof queryKeys;
export type QueryKeyNames = keyof QueryKeys;
