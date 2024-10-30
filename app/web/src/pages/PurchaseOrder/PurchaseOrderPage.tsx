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
import { DatePickerInput } from "@mantine/dates";
import { useEffect, useRef, useState } from "react";
import { ErrorState } from "~/components/ErrorState";
import { Icon } from "~/components/Icon";
import { LoadingState } from "~/components/LoadingState";
import { Api } from "~/config/api";
import { useInvalidateQuery } from "~/hooks/useInvalidateQuery";
import { useNavigate } from "~/hooks/useNavigate";
import { useParams } from "~/hooks/useParams";
import { usePersistable } from "~/hooks/usePersistable";
import { formValidations } from "~/utils/formValidations";
import { OptionData, PurchaseOrderForm } from "~/types";
import { purchaseOrderStatus } from "@app/common";
import { useSupplierSelectOptions } from "~/hooks/useSupplierSelectOptions";
import { formatDateCode } from "~/utils/formatDateCode";
import { calculateCode } from "~/utils/calculateCode";
import { SelectE } from "~/components/SelectE";
import {
  PurchaseOrderItemTable,
  PurchaseOrderItemTableHandler,
} from "~/pages/PurchaseOrder/PurchaseOrderPage/PurchaseOrderPage.ItemTable";

const defaultSpan = {};

export default function PurchaseOrderPage() {
  const { idOrCode } = useParams("purchaseOrderEdit");
  const supplierOptions = useSupplierSelectOptions();
  const isEditMode = idOrCode !== undefined;
  const [autoCode, setAutoCode] = useState(!isEditMode);
  const [isActing, setIsActing] = useState(false);
  const purchaseOrderItemTableRef =
    useRef<PurchaseOrderItemTableHandler | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<OptionData | null>(
    null
  );
  const { mutateAsync: create } =
    Api.purchaseOrder.createPurchaseOrder.useRequest();
  const {
    data: d,
    error,
    isLoading,
  } = Api.purchaseOrder.getPurchaseOrder.useRequest(
    { idOrCode },
    {},
    {
      enabled: isEditMode,
    }
  );
  const data = usePersistable(d);
  const { mutateAsync: update } =
    Api.purchaseOrder.updatePurchaseOrder.useRequest({ id: data?.id ?? "" });
  const { mutateAsync: syncItems } =
    Api.purchaseOrder.syncPurchaseOrderItems.useRequest({ id: data?.id ?? "" });
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

  const handleCreate = async () => {
    if (!purchaseOrderItemTableRef.current) {
      return;
    }
    setIsActing(true);
    const items = purchaseOrderItemTableRef.current.getValues();
    const result = await create(values);
    await Api.purchaseOrder.syncPurchaseOrderItems.request(
      { id: result.id },
      { items }
    );
    await invalidateQuery("purchaseOrder");
    setIsActing(false);
    navigate("purchaseOrderEdit", { idOrCode: result.id });
  };

  const handleUpdate = async () => {
    if (!purchaseOrderItemTableRef.current) {
      return;
    }
    setIsActing(true);
    const items = purchaseOrderItemTableRef.current.getValues();
    await Promise.all([update(values), syncItems({ items })]);
    await invalidateQuery("purchaseOrder");
    setIsActing(false);
  };

  const save = () => {
    if (!purchaseOrderItemTableRef.current) {
      return;
    }
    const itemsValid = purchaseOrderItemTableRef.current.validate();
    const { hasErrors } = validate();
    if (hasErrors || !itemsValid) {
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
          <Select
            required
            label="Status"
            data={purchaseOrderStatus}
            disabled={!isEditMode}
            {...getInputProps("status")}
          />
        </Grid.Col>
      </Grid>
      <Title order={2}>Items</Title>
      <PurchaseOrderItemTable
        initialData={d?.purchaseOrderItems || []}
        ref={purchaseOrderItemTableRef}
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
