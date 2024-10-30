import { getServerInfoContract } from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { customerApi } from "~/config/api/customerApi";
import { enumApi } from "~/config/api/enumApi";
import { materialApi } from "~/config/api/materialApi";
import { purchaseOrderApi } from "~/config/api/purchaseOrderApi";
import { purchaseOrderItemApi } from "~/config/api/purchaseOrderItemApi";
import { sessionApi } from "~/config/api/sessionApi";
import { supplierApi } from "~/config/api/supplierApi";

import { appConfig } from "~/config/app";
import { queryKeys } from "~/config/queryKeys";

export const Api = {
  getServerInfo: apiClient.registerQueryContract(
    getServerInfoContract,
    queryKeys.serverInfo
  ),
  enum: enumApi,
  session: sessionApi,
  material: materialApi,
  supplier: supplierApi,
  customer: customerApi,

  purchaseOrder: purchaseOrderApi,
  purchaseOrderItem: purchaseOrderItemApi,
};
if (appConfig.exposeApiClient) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (window as any).apiClient = Api;
}
