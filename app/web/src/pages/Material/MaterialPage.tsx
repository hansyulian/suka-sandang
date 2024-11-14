import {
  Badge,
  Button,
  ColorPicker,
  Grid,
  Group,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { MaterialForm } from "~/types/forms";
import { formValidations } from "~/utils/formValidations";
import { calculateCode } from "~/utils/calculateCode";
import { useMaterialStatusOptions } from "~/hooks/useMaterialStatusOptions";
import { getStatusColor } from "~/utils/getStatusColor";
import { SegmentedControlInput } from "~/components/SegmentedControlInput";
import {
  createMaterialApi,
  getMaterialApi,
  updateMaterialApi,
} from "~/config/api/materialApi";

const defaultSpan = {};

export default function Page() {
  const { idOrCode } = useParams("materialEdit");
  const isEditMode = idOrCode !== undefined;
  const [autoCode, setAutoCode] = useState(!isEditMode);
  const materialStatusOptions = useMaterialStatusOptions();
  const { mutateAsync: create, isPending: isCreatePending } =
    createMaterialApi.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = getMaterialApi.useRequest(
    { idOrCode },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    updateMaterialApi.useRequest({ id: data?.id ?? "" });

  const navigate = useNavigate();
  const invalidateQuery = useInvalidateQuery();
  const isDeleted = !!data?.deletedAt;
  const { setValues, getInputProps, validate, values } = useForm<MaterialForm>({
    initialValues: {
      name: "",
      code: "",
      color: "",
      purchasePrice: undefined,
      retailPrice: undefined,
      status: "draft",
    },
    validate: {
      name: formValidations({ required: true }),
      code: formValidations({ required: true }),
    },
  });

  const handleCreate = async () => {
    await create(values);
    await invalidateQuery("material");
    navigate("materialList", {});
  };

  const handleUpdate = async () => {
    await update(values);
    await invalidateQuery("material");
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
      setAutoCode(false);
    }
  }, [data, setValues]);

  useEffect(() => {
    if (!autoCode) {
      return;
    }
    if (values.name) {
      setValues({
        code: calculateCode(values.name),
      });
    }
  }, [autoCode, setValues, values.name]);

  const onCancel = () => {
    navigate("materialList", {});
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
        <Title>{isEditMode ? `Material: ${data?.name}` : "New Material"}</Title>
        {isDeleted && <Badge color="red">Deleted</Badge>}
      </Group>
      <Grid mb="lg">
        <Grid.Col span={defaultSpan}>
          <TextInput label="Name" required {...getInputProps("name")} />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <TextInput
            label="Code"
            required
            {...getInputProps("code")}
            onChange={(e) => {
              setAutoCode(false);
              return getInputProps("code").onChange(e);
            }}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <NumberInput
            label="Purchase Price"
            hideControls
            {...getInputProps("purchasePrice")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <NumberInput
            label="Retail Price"
            hideControls
            {...getInputProps("retailPrice")}
          />
        </Grid.Col>
        <Grid.Col>
          <SegmentedControlInput
            label="Status"
            data={materialStatusOptions}
            color={getStatusColor(values.status)}
            {...getInputProps("status")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <Stack>
            <TextInput label="Color" {...getInputProps("color")} />
            <ColorPicker format="hex" fullWidth {...getInputProps("color")} />
          </Stack>
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
