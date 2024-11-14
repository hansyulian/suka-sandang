import { PurchaseOrderStatus } from "@app/common";
import { ContractResponseModel } from "@hyulian/react-api-contract";
import { useMemo } from "react";
import { getPurchaseOrderApi } from "~/config/api/purchaseOrderApi";
import { purchaseOrderStatusLabels } from "~/config/constants";

export function usePurchaseOrderStatusOptions(
  data?: ContractResponseModel<typeof getPurchaseOrderApi>
) {
  const isEdit = !!data;
  const isDraft = data?.status === "draft";
  const isProcessing = data?.status === "processing";
  return useMemo<SelectionOption<PurchaseOrderStatus>[]>(() => {
    return [
      {
        label: purchaseOrderStatusLabels.draft,
        value: "draft",
        disabled: !isDraft,
      },
      {
        label: purchaseOrderStatusLabels.processing,
        value: "processing",
        disabled: !isEdit || !isDraft || !isProcessing,
      },
      {
        label: purchaseOrderStatusLabels.completed,
        value: "completed",
        disabled: !isEdit || !isProcessing,
      },
      {
        label: purchaseOrderStatusLabels.cancelled,
        value: "cancelled",
        disabled: !isEdit || !isDraft || !isProcessing,
      },
      {
        label: purchaseOrderStatusLabels.deleted,
        value: "deleted",
        disabled: !isEdit || !isDraft,
      },
    ];
  }, [isDraft, isEdit, isProcessing]);
}
