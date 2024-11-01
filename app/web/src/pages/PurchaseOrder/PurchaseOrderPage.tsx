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
import { DatePickerInput } from "@mantine/dates";
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
  syncPurchaseOrderItemsApi,
  updatePurchaseOrderApi,
} from "~/config/api/purchaseOrderApi";

const defaultSpan = {};

export default function PurchaseOrderPage() {
  const { idOrCode } = useParams("purchaseOrderEdit");
  const supplierOptions = useSupplierSelectOptions();
  const isEditMode = idOrCode !== undefined;
  const [autoCode, setAutoCode] = useState(!isEditMode);
  const purchaseOrderStatusOptions = usePurchaseOrderStatusOptions();
  const [isActing, setIsActing] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<OptionData | null>(
    null
  );
  const [forms, setForms] = useState<
    UseFormReturnType<PurchaseOrderItemForm>[]
  >([]);

  const { mutateAsync: create } = createPurchaseOrderApi.useRequest();
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
  const data = usePersistable(d);
  const { mutateAsync: update } = updatePurchaseOrderApi.useRequest({
    id: data?.id ?? "",
  });
  const { mutateAsync: syncItems } = syncPurchaseOrderItemsApi.useRequest(
    { id: data?.id ?? "" },
    { onSuccess: () => {} }
  );
  const navigate = useNavigate();
  const invalidateQuery = useInvalidateQuery();
  const isDeleted = !!data?.deletedAt;
  const { setValues, getInputProps, validate, values } =
    useForm<PurchaseOrderForm>({
      initialValues: {
        code: `po-${formatDateCode()}`,
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
        code: `po-${calculateCode(selectedSupplier.label)}-${formatDateCode()}`,
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
    setIsActing(true);
    const result = await create(values);
    await syncPurchaseOrderItemsApi.request(
      { id: result.id },
      { items: getItems() }
    );
    await invalidateQuery("purchaseOrder");
    setIsActing(false);
    navigate("purchaseOrderEdit", { idOrCode: result.id });
  };

  const handleUpdate = async () => {
    setIsActing(true);
    await Promise.all([update(values), syncItems({ items: getItems() })]);
    await invalidateQuery("purchaseOrder");
    setIsActing(false);
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
          <SelectE
            disabled={isEditMode}
            label="Supplier"
            data={supplierOptions}
            required
            searchable
            onSelectOption={setSelectedSupplier}
            {...getInputProps("supplierId")}
          />
        </Grid.Col>
        <Grid.Col span={defaultSpan}>
          <DatePickerInput
            disabled={isEditMode}
            label="Date"
            required
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
        initialData={d?.purchaseOrderItems || []}
        onFormsChange={setForms}
        disabled={data?.status !== "draft"}
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
