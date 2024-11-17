import {
  Badge,
  Button,
  Grid,
  Group,
  Stack,
  Textarea,
  Title,
} from "@mantine/core";
import { useForm, UseFormReturnType } from "@mantine/form";
import { useEffect, useState } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { formValidations } from "~/utils/formValidations";
import { OptionData, PurchaseOrderForm, PurchaseOrderItemForm } from "~/types";
import { useSupplierSelectOptions } from "~/hooks/useSupplierSelectOptions";
import { formatDateCode } from "~/utils/formatDateCode";
import { calculateCode } from "~/utils/calculateCode";
import { SelectE } from "~/components/SelectE";
import { PurchaseOrderItemTable } from "~/pages/PurchaseOrder/PurchaseOrderPage/PurchaseOrderPage.ItemTable";
import { SegmentedControlInput } from "~/components/SegmentedControlInput";
import { usePurchaseOrderStatusOptions } from "~/hooks/usePurchaseOrderStatusOptions";
import { getStatusColor } from "~/utils/getStatusColor";
import {
  createPurchaseOrderApi,
  getPurchaseOrderApi,
  updatePurchaseOrderApi,
} from "~/config/api/purchaseOrderApi";
import { generateRandomCodeNumber } from "~/utils/generateRandomCodeNumber";
import { TextInputE } from "~/components/TextInputE";
import { DatePickerInputE } from "~/components/DatePickerE";

const defaultSpan = {};

export default function Page() {
  const { idOrCode } = useParams("purchaseOrderEdit");
  const supplierOptions = useSupplierSelectOptions();
  const isEditMode = idOrCode !== undefined;
  const [autoCode, setAutoCode] = useState(!isEditMode);
  const [selectedSupplier, setSelectedSupplier] = useState<OptionData | null>(
    null
  );
  const [forms, setForms] = useState<
    UseFormReturnType<PurchaseOrderItemForm>[]
  >([]);

  const { mutateAsync: create, isPending: isCreatePending } =
    createPurchaseOrderApi.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = getPurchaseOrderApi.useRequest(
    { idOrCode },
    {},
    {
      enabled: isEditMode,
    }
  );
  const purchaseOrderStatusOptions = usePurchaseOrderStatusOptions(d);
  const data = usePersistable(d);
  const { mutateAsync: update, isPending: isUpdatePending } =
    updatePurchaseOrderApi.useRequest({
      id: data?.id ?? "",
    });
  const navigate = useNavigate();
  const invalidateQuery = useInvalidateQuery();
  const isDeleted = !!data?.deletedAt;
  const { setValues, getInputProps, validate, values } =
    useForm<PurchaseOrderForm>({
      initialValues: {
        code: `po-${formatDateCode()}-${generateRandomCodeNumber()}`,
        date: new Date(),
        status: "draft",
        supplierId: "",
        remarks: "",
      },
      validate: {
        code: formValidations({ required: true }),
        date: formValidations({ required: true }),
        supplierId: formValidations({ required: true }),
      },
    });

  useEffect(() => {
    if (!autoCode) {
      return;
    }
    if (selectedSupplier) {
      setValues({
        code: `po-${calculateCode(
          selectedSupplier.label
        )}-${formatDateCode()}-${generateRandomCodeNumber()}`,
      });
    }
  }, [autoCode, selectedSupplier, setValues]);

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
    const result = await create({
      ...values,
      items: getItems(),
    });
    await invalidateQuery("purchaseOrder");
    navigate("purchaseOrderEdit", { idOrCode: result.id });
  };

  const handleUpdate = async () => {
    await update({ ...values, items: getItems() });
    await Promise.all([
      invalidateQuery("purchaseOrder"),
      invalidateQuery("purchaseOrder", { idOrCode }),
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
    if (data) {
      setValues({
        ...data,
      });
    }
  }, [data, setValues]);
  const onCancel = () => {
    navigate("purchaseOrderList", {});
  };

  if (isLoading) {
    return <LoadingState />;
  }
  if (error) {
    return <ErrorState error={error} />;
  }
  const isActing = isCreatePending || isUpdatePending;
  return (
    <Stack>
      <Group>
        <Title>
          {isEditMode ? `Purchase Order: ${data?.code}` : "New Purchase Order"}
        </Title>
        {isDeleted && <Badge color="red">Deleted</Badge>}
      </Group>
      <Grid mb="lg">
        <Grid.Col span={defaultSpan}>
          <TextInputE
            label="Code"
            disabled={isEditMode}
            required
            plainDisabled
            {...getInputProps("code")}
            onChange={(event) => {
              setAutoCode(false);
              return getInputProps("code").onChange(event);
            }}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <SelectE
            disabled={isEditMode}
            label="Supplier"
            data={supplierOptions}
            required
            plainDisabled
            searchable
            onSelectOption={setSelectedSupplier}
            {...getInputProps("supplierId")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <DatePickerInputE
            disabled={isEditMode}
            label="Date"
            required
            plainDisabled
            {...getInputProps("date")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <Textarea rows={5} label="Remarks" {...getInputProps("remarks")} />
        </Grid.Col>
        <Grid.Col>
          <SegmentedControlInput
            label="Status"
            data={purchaseOrderStatusOptions}
            disabled={!isEditMode}
            color={getStatusColor(values.status)}
            {...getInputProps("status")}
          />
        </Grid.Col>
      </Grid>
      <Title order={2}>Items</Title>
      <PurchaseOrderItemTable
        initialData={d?.purchaseOrderItems}
        onFormsChange={setForms}
        disabled={isEditMode && data?.status !== "draft"}
      />
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
