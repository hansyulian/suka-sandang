import { materialStatus } from "@app/common";
import {
  Badge,
  Button,
  ColorPicker,
  Grid,
  Group,
  NumberInput,
  Select,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { Api } from "~/config/api";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { MaterialForm } from "~/types/forms";
import { calculateSlug } from "~/utils/calculateSlug";
import { formValidations } from "~/utils/formValidations";

const defaultSpan = {};

export default function MaterialPage() {
  const { idOrCode } = useParams("materialEdit");
  const isEditMode = idOrCode !== undefined;
  const [autoSlug, setAutoSlug] = useState(true);
  const { mutateAsync: create, isPending: isCreatePending } =
    Api.material.createMaterial.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = Api.material.getMaterial.useRequest(
    { idOrCode },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    Api.material.updateMaterial.useRequest({ id: data?.id ?? "" });

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
    const result = await create(values);
    await invalidateQuery("material");
    navigate("materialEdit", { idOrCode: result.code });
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
      setAutoSlug(false);
    }
  }, [data, setValues]);

  useEffect(() => {
    if (!autoSlug) {
      return;
    }
    if (values.name) {
      setValues({
        code: calculateSlug(values.name),
      });
    }
  }, [autoSlug, setValues, values.name]);

  const onSlugChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setAutoSlug(false);
    return getInputProps("code").onChange(e);
  };
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
        <Title>{isEditMode ? data?.name : "New Material"}</Title>
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
            onChange={onSlugChange}
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
          <Select
            required
            label="Status"
            data={materialStatus}
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
