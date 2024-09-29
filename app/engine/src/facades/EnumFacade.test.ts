import { Engine } from "~/Engine";
import { enumFixtures } from "~test/fixtures/enumFixtures";
import { initializeDatabase } from "~test/utils/initializeDatabase";
import { resetData } from "~test/utils/resetData";
import { Enum } from "~/models/Enum";

describe("EnumFacade", () => {
  const engine = new Engine();

  describe("list", () => {
    beforeAll(async () => {
      initializeDatabase();
      await resetData();
      await enumFixtures();
    });

    it("should return all records in the Enum table", async () => {
      const list = await engine.enum.list();
      expect(list.records).toHaveLength(30);
      expect(list.records[0]).toHaveProperty("value");
      expect(list.records[0]).toHaveProperty("group");
    });
  });

  describe("upsert", () => {
    beforeEach(async () => {
      initializeDatabase();
      await resetData();
      await enumFixtures();
    });

    it("should create a new record if it does not exist", async () => {
      const newRecord = {
        group: "group-3",
        value: "group-3-value-1",
      };
      const result = await engine.enum.upsert(newRecord);

      const foundRecord = await Enum.findOne({
        where: { group: "group-3", value: "group-3-value-1" },
      });
      expect(foundRecord).not.toBeNull();
      expect(foundRecord?.group).toBe("group-3");
      expect(foundRecord?.value).toBe("group-3-value-1");
    });

    it("should return an existing record if the value and group already exist", async () => {
      const existingRecord = {
        group: "group-0",
        value: "group-0-value-0",
      };
      const result = await engine.enum.upsert(existingRecord);

      const foundRecord = await Enum.findOne({
        where: { group: "group-0", value: "group-0-value-0" },
      });
      expect(result.id).toBe(foundRecord?.id);
    });
  });

  describe("syncGroup", () => {
    beforeEach(async () => {
      initializeDatabase();
      await resetData();
      await enumFixtures();
    });

    it("should delete records not in the new values and create new ones", async () => {
      const group = "group-0";
      const values = ["group-0-value-0", "group-0-new-value-1"];

      await engine.enum.syncGroup(group, values);

      // Ensure the correct values are created
      const allRecords = await Enum.findAll({ where: { group } });
      const valuesInDB = allRecords.map((record) => record.value);

      expect(valuesInDB).toEqual(expect.arrayContaining(values));
      expect(valuesInDB).not.toContain("group-0-value-1");

      // Ensure deleted values are removed from the DB
      const deletedRecord = await Enum.findOne({
        where: { group, value: "group-0-value-1" },
      });
      expect(deletedRecord).toBeNull();
    });

    it("should handle creating only new values without deleting existing ones", async () => {
      const group = "group-1";
      const values = ["group-1-value-0", "group-1-new-value-2"];

      await engine.enum.syncGroup(group, values);

      // Verify values in database
      const allRecords = await Enum.findAll({ where: { group } });
      const valuesInDB = allRecords.map((record) => record.value);

      expect(valuesInDB).toEqual(expect.arrayContaining(values));
      expect(valuesInDB).toContain("group-1-value-0");
      expect(valuesInDB).toContain("group-1-new-value-2");
    });
  });
});
