import { FindAllResult } from "~/types";
import { FacadeBase } from "~/facades/FacadeBase";
import { Enum } from "~/models/Enum";
import { EnumAttributes, OmitBase } from "@app/common";
import { filterDuplicates, indexArray, valueIndex } from "@hyulian/common";

export class EnumFacade extends FacadeBase {
  async list(): Promise<FindAllResult<Enum>> {
    const result = await Enum.findAll();
    return {
      records: result,
    };
  }

  async upsert(record: OmitBase<EnumAttributes>) {
    const foundRecord = await Enum.findOne({
      where: {
        value: record.value,
        group: record.group,
      },
    });
    if (foundRecord) {
      return foundRecord;
    }
    const result = await Enum.create({
      ...record,
    });
    return result;
  }

  async syncGroup(group: string, values: string[]) {
    const records = await Enum.findAll({
      where: {
        group,
      },
    });
    const cleanedValues = filterDuplicates(values); // guaranteed no duplciate values
    const recordsIndex: Record<string, Enum | undefined> = indexArray(
      records,
      "value"
    ); // undefined = not deleted, with value = to be deleted
    const valuesToBeCreated = [];
    for (const value of cleanedValues) {
      if (recordsIndex[value]) {
        recordsIndex[value] = undefined;
      } else if (!recordsIndex[value]) {
        valuesToBeCreated.push(value);
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
    for (const value of valuesToBeCreated) {
      promises.push(
        Enum.create({
          group,
          value,
        })
      );
    }
    await Promise.all(promises);
  }
}
