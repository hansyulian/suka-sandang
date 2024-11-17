import { Engine } from "~/CoreEngine";
import { enumFixtures } from "~test/fixtures/enumFixtures";
import { resetData } from "~test/utils/resetData";
import { Enum } from "~/models/Enum";
import { GroupSyncPayload } from "~/engine/EnumEngine";

describe("EnumEngine", () => {
  const engine = new Engine();

  describe("list", () => {
    beforeAll(async () => {
      await resetData();
      await enumFixtures();
    });

    it("should return all records in the Enum table", async () => {
      const list = await engine.enum.list();
      expect(list.records).toHaveLength(30);
      expect(list.records[0]).toHaveProperty("value");
      expect(list.records[0]).toHaveProperty("group");
      expect(list.records[0]).toHaveProperty("label");
    });
  });

  describe("upsert", () => {
    beforeEach(async () => {
      await resetData();
      await enumFixtures();
    });

    it("should create a new record if it does not exist", async () => {
      const newRecord = {
        group: "group-3",
        value: "group-3-value-1",
        label: "group-3-label-1",
      };
      const result = await engine.enum.upsert(newRecord);

      const foundRecord = await Enum.findOne({
        where: { group: "group-3", value: "group-3-value-1" },
      });
      expect(foundRecord).not.toBeNull();
      expect(foundRecord?.group).toStrictEqual("group-3");
      expect(foundRecord?.value).toStrictEqual("group-3-value-1");
      expect(foundRecord?.label).toStrictEqual("group-3-label-1");
    });

    it("should return an existing record if the value and group already exist", async () => {
      const existingRecord = {
        group: "group-0",
        value: "group-0-value-0",
        label: "group-0-label-0-updated",
      };
      const result = await engine.enum.upsert(existingRecord);

      const foundRecord = await Enum.findOne({
        where: { group: "group-0", value: "group-0-value-0" },
      });
      expect(result.id).toStrictEqual(foundRecord?.id);
      expect(result.value).toStrictEqual(existingRecord.value);
      expect(result.label).toStrictEqual(existingRecord.label);
    });
  });

  describe("syncGroup", () => {
    beforeEach(async () => {
      await resetData();
      await enumFixtures();
    });

    it("should delete records not in the new values and create new ones", async () => {
      const group = "group-0";
      const syncPayloads: GroupSyncPayload[] = [
        {
          value: "group-1-value-0",
          label: "group-1-label-0",
        },
        {
          value: "group-1-new-value-1",
          label: "group-1-new-label-1",
        },
      ];

      await engine.enum.syncGroup(group, syncPayloads);

      // Ensure the correct values are created
      const allRecords = await Enum.findAll({ where: { group } });
      const valuesInDB = allRecords.map((record) => record.value);

      expect(valuesInDB).toEqual(
        expect.arrayContaining(syncPayloads.map((record) => record.value))
      );
      expect(valuesInDB).not.toContain("group-0-value-1");

      // Ensure deleted values are removed from the DB
      const deletedRecord = await Enum.findOne({
        where: { group, value: "group-0-value-1" },
      });
      expect(deletedRecord).toBeNull();
    });

    it("should handle creating only new values without deleting existing ones", async () => {
      const group = "group-1";
      const syncPayloads: GroupSyncPayload[] = [
        {
          value: "group-1-value-0",
          label: "group-1-label-0",
        },
        {
          value: "group-1-new-value-2",
          label: "group-1-new-label-2",
        },
      ];

      await engine.enum.syncGroup(group, syncPayloads);

      // Verify values in database
      const allRecords = await Enum.findAll({ where: { group } });
      const valuesInDB = allRecords.map((record) => record.value);

      expect(valuesInDB).toEqual(
        expect.arrayContaining(syncPayloads.map((record) => record.value))
      );
      expect(valuesInDB).toContain("group-1-value-0");
      expect(valuesInDB).toContain("group-1-new-value-2");
    });
  });
});
