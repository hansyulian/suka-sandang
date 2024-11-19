import {
  Badge,
  Button,
  Grid,
  Group,
  Modal,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { SegmentedControlInput } from "~/components/SegmentedControlInput";
import {
  createCustomerApi,
  getCustomerApi,
  updateCustomerApi,
} from "~/config/api/customerApi";
import { useCustomerStatusOptions } from "~/hooks/useCustomerStatusOptions";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { CustomerForm } from "~/types";
import { formValidations } from "~/utils/formValidations";
import { getStatusColor } from "~/utils/getStatusColor";

const defaultSpan = {};
export type CustomerListFormModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function CustomerListFormModal(props: CustomerListFormModalProps) {
  const { isVisible, onClose } = props;
  const { param } = useParams("customer");
  const isEditMode = !!param && param !== "add";
  const id = isEditMode ? param : undefined;
  const customerStatusOptions = useCustomerStatusOptions();
  const { mutateAsync: create, isPending: isCreatePending } =
    createCustomerApi.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = getCustomerApi.useRequest(
    { id: id ?? "" },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    updateCustomerApi.useRequest({ id: data?.id ?? "" });
  const navigate = useNavigate();
  const invalidateQuery = useInvalidateQuery();
  const isDeleted = !!data?.deletedAt;
  const { setValues, getInputProps, validate, values } = useForm<CustomerForm>({
    initialValues: {
      name: "",
      address: "",
      email: "",
      phone: "",
      identity: "",
      remarks: "",
      status: "draft",
    },
    validate: {
      name: formValidations({ required: true }),
    },
  });

  const handleCreate = async () => {
    await create(values);
    await invalidateQuery("customer");
    onClose();
  };

  const handleUpdate = async () => {
    await update(values);
    await invalidateQuery("customer");
    onClose();
  };

  const save = () => {
    const { hasErrors } = validate();
    if (hasErrors) {
      return;
    }
    if (isEditMode) {
      return handleUpdate();
    }
    return handleCreate();
  };

  const isActing = isCreatePending || isUpdatePending;

  useEffect(() => {
    if (data) {
      setValues({
        ...data,
      });
    }
  }, [data, setValues]);
  const onCancel = () => {
    navigate("customer", {});
  };

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <Modal opened={isVisible} withCloseButton onClose={onClose} size="lg">
      <Stack>
        <Group>
          <Title>
            {isEditMode ? `Customer: ${data?.name}` : "New Customer"}
          </Title>
          {isDeleted && <Badge color="red">Deleted</Badge>}
        </Group>
        <Grid mb="lg">
          <Grid.Col span={defaultSpan}>
            <TextInput label="Name" required {...getInputProps("name")} />
          </Grid.Col>
          <Grid.Col span={defaultSpan}>
            <TextInput label="Identity" {...getInputProps("identity")} />
          </Grid.Col>
          <Grid.Col span={defaultSpan}>
            <TextInput label="Email" {...getInputProps("email")} />
          </Grid.Col>
          <Grid.Col span={defaultSpan}>
            <TextInput label="Phone" {...getInputProps("phone")} />
          </Grid.Col>
          <Grid.Col span={defaultSpan}>
            <Textarea rows={5} label="Address" {...getInputProps("address")} />
          </Grid.Col>
          <Grid.Col span={defaultSpan}>
            <Textarea rows={5} label="Remarks" {...getInputProps("remarks")} />
          </Grid.Col>
          <Grid.Col>
            <SegmentedControlInput
              label="Status"
              data={customerStatusOptions}
              color={getStatusColor(values.status)}
              {...getInputProps("status")}
            />
          </Grid.Col>
        </Grid>
        <Grid>
          <Grid.Col span={{ md: 6 }}></Grid.Col>
          <Grid.Col span={{ md: 3 }}>
            <Button
              onClick={save}
              fullWidth
              leftSection={<Icon name="save" />}
              loading={isActing}
            >
              Save
            </Button>
          </Grid.Col>
          <Grid.Col span={{ md: 3 }}>
            <Button
              onClick={onCancel}
              color="red"
              fullWidth
              leftSection={<Icon name="close" />}
            >
              Cancel
            </Button>
          </Grid.Col>
        </Grid>
      </Stack>
    </Modal>
  );
}
