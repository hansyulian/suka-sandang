import { Highlight } from "@mantine/core";
import { modals } from "@mantine/modals";
import { ReactNode } from "react";

export type ConfirmationDialogOptions = {
  title?: string;
  message?: string;
  children?: ReactNode;
  highlight?: string | string[];
  onConfirm?: () => void;
  onCancel?: () => void;
  variant?: "default" | "danger";
};

export function useConfirmationDialog(
  baseOptions: ConfirmationDialogOptions = {}
) {
  return (options: ConfirmationDialogOptions = {}) => {
    const title = options.title || baseOptions.title || "Confirmation";
    const message = options.message || baseOptions.message;
    const highlight = [
      ...(baseOptions.highlight || []),
      ...(options.highlight || []),
    ];
    const children =
      options.children ||
      baseOptions.children ||
      (message ? (
        <Highlight highlight={highlight}>{message}</Highlight>
      ) : undefined);
    const onConfirm = options.onConfirm || baseOptions.onCancel;
    const onCancel = options.onCancel || baseOptions.onCancel;
    const color = getModalColor(options);
    modals.openConfirmModal({
      title,
      children,
      onConfirm,
      onCancel,
      confirmProps: {
        color,
      },
      labels: {
        cancel: "Cancel",
        confirm: "Confirm",
      },
    });
  };
}

function getModalColor(options: ConfirmationDialogOptions) {
  switch (options.variant) {
    case "danger":
      return "red";
  }
}
