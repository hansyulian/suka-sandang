/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactApiContractClientMutationOptions } from "@hyulian/react-api-contract";
import { notifications } from "@mantine/notifications";
import { Icon } from "~/components/Icon";

export type ApiMutationOptions = {
  title: string;
  message: string;
  successMessage?: string;
};

export function apiMutationOptions(
  options: ApiMutationOptions
): ReactApiContractClientMutationOptions {
  const { title, successMessage, message } = options;
  let id: any = null;
  return {
    onMutate: () => {
      id = notifications.show({
        loading: true,
        title,
        autoClose: false,
        withCloseButton: false,
        message,
      });
    },
    onSuccess: () => {
      notifications.update({
        id,
        color: "green",
        message: successMessage || message,
        icon: <Icon name="notificationSuccess" />,
        autoClose: 2000,
        loading: false,
        withCloseButton: true,
      });
    },
    onError: (error) => {
      notifications.update({
        id,
        color: "red",
        message: error.message,
        icon: <Icon name="notificationError" />,
        autoClose: false,
        withCloseButton: true,
      });
    },
  };
}
