import { customerStatus } from "@app/common";
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
import { formValidations } from "~/utils/formValidations";
import { CustomerForm } from "~/types";

const defaultSpan = {};

export default function CustomerPage() {
  const { id } = useParams("customerEdit");
  const isEditMode = id !== undefined;
  const { mutateAsync: create, isPending: isCreatePending } =
    Api.customer.createCustomer.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = Api.customer.getCustomer.useRequest(
    { id },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    Api.customer.updateCustomer.useRequest({ id: data?.id ?? "" });
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
      email: formValidations({ required: true }),
    },
  });

  const handleCreate = async () => {
    const result = await create(values);
    await invalidateQuery("customer");
    navigate("customerEdit", { id: result.id });
  };

  const handleUpdate = async () => {
    await update(values);
    await invalidateQuery("customer");
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
    navigate("customerList", {});
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
        <Title>{isEditMode ? data?.name : "New Customer"}</Title>
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
            data={customerStatus}
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
