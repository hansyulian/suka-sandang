/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactApiContractClientMutationOptions } from "@hyulian/react-api-contract";
import { notifications } from "@mantine/notifications";
import { Text, Stack, Code, UnstyledButton } from "@mantine/core";
import { Icon } from "~/components/Icon";
import { modals } from "@mantine/modals";

export type ApiMutationOptions = {
  title: string;
  message: string;
  successMessage?: string;
};

const showErrorDetails = (details: any, stack: string[]) =>
  modals.open({
    size: "xl",
    children: (
      <Stack>
        <Text>Details</Text>
        <Code>
          <pre>{JSON.stringify(details, null, 4)}</pre>
        </Code>
        <Text>Stack</Text>
        <Code>
          <pre>{JSON.stringify(stack, null, 4)}</pre>
        </Code>
      </Stack>
    ),
  });

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
      console.error(error);
      const errorData = error.response.data;
      const name = errorData?.name || error.message;
      const details = errorData?.details || {};
      const stack = errorData?.stack || [];
      notifications.update({
        id,
        color: "red",
        message: (
          <Stack>
            <Text>{name}</Text>
            <UnstyledButton
              variant="white"
              onClick={() => showErrorDetails(details, stack)}
            >
              <Text c="blue">Details</Text>
            </UnstyledButton>
          </Stack>
        ),
        icon: <Icon name="notificationError" />,
        autoClose: 10000,
        loading: false,
        withCloseButton: true,
      });
    },
  };
}
