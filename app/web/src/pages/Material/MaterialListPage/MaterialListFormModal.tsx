import {
  Badge,
  Button,
  ColorPicker,
  Grid,
  Group,
  Modal,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState, useEffect } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { NumberInputE } from "~/components/NumberInputE";
import { SegmentedControlInput } from "~/components/SegmentedControlInput";
import {
  createMaterialApi,
  getMaterialApi,
  updateMaterialApi,
} from "~/config/api/materialApi";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useMaterialStatusOptions } from "~/hooks/useMaterialStatusOptions";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { MaterialForm } from "~/types";
import { calculateCode } from "~/utils/calculateCode";
import { formValidations } from "~/utils/formValidations";
import { getStatusColor } from "~/utils/getStatusColor";

const defaultSpan = {};
export type MaterialListFormModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export function MaterialListFormModal(props: MaterialListFormModalProps) {
  const { isVisible, onClose } = props;
  const { param } = useParams("material");
  const isEditMode = !!param && param !== "add";
  const idOrCode = isEditMode ? param : undefined;
  const [autoCode, setAutoCode] = useState(!isEditMode);
  const materialStatusOptions = useMaterialStatusOptions();
  const { mutateAsync: create, isPending: isCreatePending } =
    createMaterialApi.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = getMaterialApi.useRequest(
    { idOrCode: idOrCode ?? "" },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    updateMaterialApi.useRequest({ id: data?.id ?? "" });

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
    onClose();
  };

  const handleUpdate = async () => {
    await update(values);
    await invalidateQuery("material");
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
          <Title order={3}>
            {isEditMode ? `Material: ${data?.name}` : "New Material"}
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
          <NumberInputE
            label="Purchase Price"
            hideControls
            rightAlign
            {...getInputProps("purchasePrice")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <NumberInputE
            label="Retail Price"
            hideControls
            rightAlign
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
