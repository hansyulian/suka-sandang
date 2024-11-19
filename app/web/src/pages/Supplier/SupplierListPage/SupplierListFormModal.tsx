import {
  Badge,
  Button,
  Grid,
  Group,
  Modal,
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
  createSupplierApi,
  getSupplierApi,
  updateSupplierApi,
} from "~/config/api/supplierApi";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { useSupplierStatusOptions } from "~/hooks/useSupplierStatusOptions";
import { SupplierForm } from "~/types";
import { formValidations } from "~/utils/formValidations";
import { getStatusColor } from "~/utils/getStatusColor";

const defaultSpan = {};
export type SupplierListFormModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function SupplierListFormModal(props: SupplierListFormModalProps) {
  const { isVisible, onClose } = props;
  const { param } = useParams("supplier");
  const isEditMode = !!param && param !== "add";
  const id = isEditMode ? param : undefined;
  const supplierStatusOptions = useSupplierStatusOptions();
  const { mutateAsync: create, isPending: isCreatePending } =
    createSupplierApi.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = getSupplierApi.useRequest(
    { id: id ?? "" },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    updateSupplierApi.useRequest({ id: data?.id ?? "" });
  const invalidateQuery = useInvalidateQuery();
  const isDeleted = !!data?.deletedAt;
  const { setValues, getInputProps, validate, values } = useForm<SupplierForm>({
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
      email: formValidations({ required: true }),
    },
  });

  const handleCreate = async () => {
    await create(values);
    await invalidateQuery("supplier");
    onClose();
  };

  const handleUpdate = async () => {
    await update(values);
    await invalidateQuery("supplier");
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

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  return (
    <Modal
      opened={isVisible}
      withCloseButton
      onClose={onClose}
      size="lg"
      title={
        <Group>
          <Title>
            {isEditMode ? `Supplier: ${data?.name}` : "New Supplier"}
          </Title>
          {isDeleted && <Badge color="red">Deleted</Badge>}
        </Group>
      }
    >
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
            data={supplierStatusOptions}
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
            onClick={onClose}
            color="red"
            fullWidth
            leftSection={<Icon name="close" />}
          >
            Cancel
          </Button>
        </Grid.Col>
      </Grid>
    </Modal>
  );
}
