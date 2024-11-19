import { SalesOrderStatus } from "@app/common";
import { ContractResponseModel } from "@hyulian/react-api-contract";
import { useMemo } from "react";
import { getSalesOrderApi } from "~/config/api/salesOrderApi";
import { salesOrderStatusLabels } from "~/config/constants";

export function useSalesOrderStatusOptions(
  data?: ContractResponseModel<typeof getSalesOrderApi>
) {
  const isEdit = !!data;
  const isDraft = data?.status === "draft";
  const isProcessing = data?.status === "processing";
  return useMemo<SelectionOption<SalesOrderStatus>[]>(() => {
    return [
      {
        label: salesOrderStatusLabels.draft,
        value: "draft",
        disabled: !isDraft,
      },
      {
        label: salesOrderStatusLabels.processing,
        value: "processing",
        disabled: !isEdit || !isDraft || !isProcessing,
      },
      {
        label: salesOrderStatusLabels.completed,
        value: "completed",
        disabled: !isEdit || !isProcessing,
      },
      {
        label: salesOrderStatusLabels.cancelled,
        value: "cancelled",
        disabled: !isEdit || !isDraft || !isProcessing,
      },
      {
        label: salesOrderStatusLabels.deleted,
        value: "deleted",
        disabled: !isEdit || !isDraft,
      },
    ];
  }, [isDraft, isEdit, isProcessing]);
}
