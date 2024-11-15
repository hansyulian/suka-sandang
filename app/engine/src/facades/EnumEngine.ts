import { FindAllResult } from "~/types";
import { EngineBase } from "~/facades/EngineBase";
import { Enum } from "~/models/Enum";
import type { EnumCreationAttributes } from "@app/common";
import { filterDuplicates, indexArray } from "@hyulian/common";
import { WithTransaction } from "~/modules/WithTransactionDecorator";

export type GroupSyncPayload = {
  label: string;
  value: string;
};
export class EnumEngine extends EngineBase {
  @WithTransaction
  async list(): Promise<FindAllResult<Enum>> {
    const result = await Enum.findAll();
    return {
      records: result,
    };
  }

  @WithTransaction
  async upsert(record: EnumCreationAttributes) {
    const foundRecord = await Enum.findOne({
      where: {
        value: record.value,
        group: record.group,
      },
    });
    if (foundRecord) {
      await foundRecord.update({
        label: record.label,
      });
      return foundRecord;
    }
    const result = await Enum.create({
      ...record,
    });
    return result;
  }

  @WithTransaction
  async syncGroup(group: string, enums: GroupSyncPayload[]) {
    const records = await Enum.findAll({
      where: {
        group,
      },
    });
    const cleanedEnums = filterDuplicates(enums, (a, b) => a.value === b.value); // guaranteed no duplciate values
    const recordsIndex: Record<string, Enum | undefined> = indexArray(
      records,
      "value"
    ); // undefined = not deleted, with value = to be deleted
    const valuesToBeCreated = [];
    for (const enumPayload of cleanedEnums) {
      if (recordsIndex[enumPayload.value]) {
        recordsIndex[enumPayload.value] = undefined;
      } else if (!recordsIndex[enumPayload.value]) {
        valuesToBeCreated.push(enumPayload);
      }
    }
    const promises = [];

    // deleting
    for (const entry of Object.entries(recordsIndex)) {
      if (entry[1] !== undefined) {
        promises.push(entry[1].destroy());
      }
    }
    // creates new
    for (const enumPayload of valuesToBeCreated) {
      promises.push(
        Enum.create({
          group,
          value: enumPayload.value,
          label: enumPayload.label,
        })
      );
    }
    await Promise.all(promises);
  }
}