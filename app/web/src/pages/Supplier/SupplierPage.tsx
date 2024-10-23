import { supplierStatus } from "@app/common";
import {
  Badge,
  Button,
  Grid,
  Group,
  Select,
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
import { Api } from "~/config/api";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { SupplierForm } from "~/types/forms";
import { formValidations } from "~/utils/formValidations";

const defaultSpan = {};

export default function SupplierPage() {
  const { id } = useParams("supplierEdit");
  const isEditMode = id !== undefined;
  const { mutateAsync: create, isPending: isCreatePending } =
    Api.supplier.createSupplier.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = Api.supplier.getSupplier.useRequest(
    { id },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    Api.supplier.updateSupplier.useRequest({ id: data?.id ?? "" });
  const navigate = useNavigate();
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
    navigate("supplierList", {});
  };

  const handleUpdate = async () => {
    await update(values);
    await invalidateQuery("supplier");
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
    navigate("supplierList", {});
  };

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <Stack>
      <Group>
        <Title>{isEditMode ? `Supplier: ${data?.name}` : "New Supplier"}</Title>
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
          <Select
            required
            label="Status"
            data={supplierStatus}
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
  );
}
