import {
  Badge,
  Button,
  Grid,
  Group,
  Stack,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { formValidations } from "~/utils/formValidations";
import { InventoryForm, InventoryFlowForm } from "~/types";
import { formatDateCode } from "~/utils/formatDateCode";
import { calculateCode } from "~/utils/calculateCode";
import { InventoryFlowTable } from "~/pages/Inventory/InventoryPage/InventoryPage.FlowTable";
import {
  createInventoryApi,
  getInventoryApi,
  updateInventoryApi,
} from "~/config/api/inventoryApi";
import { useMaterialSelectOptions } from "~/hooks/useMaterialSelectOptions";
import { getMaterialOptionsApi } from "~/config/api/materialApi";
import { SelectColor } from "~/components/SelectColor";
import { ContractResponseModel } from "@hyulian/react-api-contract";
import { getStatusColor } from "~/utils/getStatusColor";
import { SegmentedControlInput } from "~/components/SegmentedControlInput";
import { useInventoryStatusOptions } from "~/hooks/useInventoryStatusOptions";

const defaultSpan = {};

export default function Page() {
  const { idOrCode } = useParams("inventoryEdit");
  const materialSelectOptions = useMaterialSelectOptions("name-code");
  const { data: materialOptions } = getMaterialOptionsApi.useRequest({}, {});
  const isEditMode = idOrCode !== undefined;
  const [autoCode, setAutoCode] = useState(!isEditMode);

  const inventoryStatusOptions = useInventoryStatusOptions();
  const [forms, setForms] = useState<UseFormReturnType<InventoryFlowForm>[]>(
    []
  );

  const { mutateAsync: create, isPending: isCreatePending } =
    createInventoryApi.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = getInventoryApi.useRequest(
    { idOrCode },
    {},
    {
      enabled: isEditMode,
    }
  );
  const inventory = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    updateInventoryApi.useRequest({
      id: inventory?.id ?? "",
    });
  const navigate = useNavigate();
  const invalidateQuery = useInvalidateQuery();
  const isDeleted = !!inventory?.deletedAt;
  const optionColorExtractor = useCallback(
    (
      record: SelectionOption<
        string,
        ContractResponseModel<typeof getMaterialOptionsApi>
      >
    ) => record.data?.color,
    []
  );
  const { setValues, getInputProps, validate, values } = useForm<InventoryForm>(
    {
      initialValues: {
        code: `inv-`,
        materialId: "",
        remarks: "",
      },
      validate: {
        code: formValidations({ required: true }),
        materialId: formValidations({ required: true }),
      },
    }
  );

  const selectedMaterial = useMemo(() => {
    return materialOptions?.records.find(
      (record) => record.id === values.materialId
    );
  }, [materialOptions?.records, values.materialId]);

  useEffect(() => {
    if (!autoCode) {
      return;
    }
    if (selectedMaterial) {
      setValues({
        code: `inv-${calculateCode(selectedMaterial.code)}-${formatDateCode()}`,
      });
    }
  }, [autoCode, selectedMaterial, setValues]);

  const validateForms = () => {
    const validation = validate();
    if (validation.hasErrors) {
      return false;
    }
    let valid = true;
    for (const form of forms) {
      const { hasErrors } = form.validate();
      if (hasErrors) {
        valid = false;
      }
    }
    return valid;
  };

  const getItems = () => forms.map((form) => form.values);

  const handleCreate = async () => {
    const result = await create(values);
    await invalidateQuery("inventory");
    navigate("inventoryEdit", { idOrCode: result.id });
  };

  const handleUpdate = async () => {
    await update({
      ...values,
      items: getItems(),
    });
    await Promise.all([
      invalidateQuery("inventory"),
      invalidateQuery("inventory", { idOrCode }),
    ]);
  };

  const save = () => {
    const formValid = validateForms();
    if (!formValid) {
      return;
    }
    if (isEditMode) {
      return handleUpdate();
    }
    return handleCreate();
  };

  useEffect(() => {
    if (inventory) {
      setValues({
        ...inventory,
      });
    }
  }, [inventory, setValues]);
  const onCancel = () => {
    navigate("inventoryList", {});
  };

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  const isActing = isUpdatePending || isCreatePending;

  return (
    <Stack>
      <Group>
        <Title>
          {isEditMode ? `Inventory: ${inventory?.code}` : "New Inventory"}
        </Title>
        {isDeleted && <Badge color="red">Deleted</Badge>}
      </Group>
      <Grid mb="lg">
        <Grid.Col span={defaultSpan}>
          <TextInput
            label="Code"
            disabled={isEditMode}
            required
            {...getInputProps("code")}
            onChange={(event) => {
              setAutoCode(false);
              return getInputProps("code").onChange(event);
            }}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <SelectColor
            flex={1}
            color={selectedMaterial?.color}
            label="Material"
            disabled={isEditMode}
            data={materialSelectOptions}
            searchable
            optionColorExtractor={optionColorExtractor}
            {...getInputProps("materialId")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <Textarea rows={5} label="Remarks" {...getInputProps("remarks")} />
        </Grid.Col>
        <Grid.Col>
          <SegmentedControlInput
            label="Status"
            data={inventoryStatusOptions}
            disabled
            color={getStatusColor(inventory?.status || "active")}
            {...getInputProps("status")}
          />
        </Grid.Col>
      </Grid>
      {isEditMode && (
        <>
          <Title order={2}>Activities</Title>

          <InventoryFlowTable
            initialData={d?.inventoryFlows || []}
            onFormsChange={setForms}
            disabled={inventory?.status !== "active"}
          />
        </>
      )}
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
