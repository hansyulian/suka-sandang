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
  materialOptions: "materialOptions",
  enum: "enum",
  supplier: "supplier",
  supplierOptions: "supplierOptions",
  customer: "customer",
  purchaseOrder: "purchaseOrder",
  purchaseOrderItem: "purchaseOrderItem",
} as const);

export type QueryKeys = typeof queryKeys;
export type QueryKeyNames = keyof QueryKeys;
