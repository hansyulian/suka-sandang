import { Op } from "sequelize";
import { SupplierNotFoundException } from "~/exceptions/SupplierNotFoundException";
import { Supplier } from "~/models/Supplier";
import {
  SupplierCreationAttributes,
  SupplierUpdateAttributes,
} from "@app/common";
import { initializeDatabase } from "~test/utils/initializeDatabase";
import { resetData } from "~test/utils/resetData";
import { supplierFixtures } from "~test/fixtures/supplierFixtures";
import { idGenerator } from "~test/utils/idGenerator";
import { Engine } from "~/Engine";
import { InvalidEmailException } from "~/exceptions/InvalidEmailException";

describe("SupplierFacade", () => {
  const engine = new Engine();
  const findAndCountAllSpy = jest.spyOn(Supplier, "findAndCountAll");
  const findByPkSpy = jest.spyOn(Supplier, "findByPk");
  const createSpy = jest.spyOn(Supplier, "create");

  beforeAll(async () => {
    await initializeDatabase();
  });

  describe("list", () => {
    beforeAll(async () => {
      await resetData();
      await supplierFixtures();
    });

    it("should return the count and records of suppliers", async () => {
      const query = {};
      const mockOptions = {};
      const findOptions = {
        where: {
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Supplier.findAndCountAll(findOptions);
      jest.clearAllMocks();

      const result = await engine.supplier.list(query, mockOptions);
      expect(findAndCountAllSpy).toHaveBeenCalledWith(findOptions);
      expect(result).toEqual({
        count: expectedResult.count,
        records: expectedResult.rows,
      });
    });

    it("should return the count and records of suppliers with query", async () => {
      const query = {
        name: {
          [Op.like]: "%Supplier 1%",
        },
      };
      const mockOptions = {};
      const findOptions = {
        where: {
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Supplier.findAndCountAll(findOptions);
      jest.clearAllMocks();
      const result = await engine.supplier.list(query, mockOptions);
      expect(findAndCountAllSpy).toHaveBeenCalledWith(findOptions);
      expect(result).toEqual({
        count: expectedResult.count,
        records: expectedResult.rows,
      });
    });
  });

  describe("findById", () => {
    beforeAll(async () => {
      await resetData();
      await supplierFixtures();
    });

    it("should return the supplier if found", async () => {
      const id = idGenerator.supplier(1);
      const supplier = await Supplier.findByPk(id);
      jest.clearAllMocks();
      const result = await engine.supplier.findById(id);

      expect(result).toEqual(supplier);
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });

    it("should throw SupplierNotFoundException if the supplier is not found", async () => {
      const id = idGenerator.supplier(9999);

      await expect(engine.supplier.findById(id)).rejects.toThrow(
        SupplierNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData();
      await supplierFixtures();
    });

    it("should create and return a new supplier", async () => {
      const createData: SupplierCreationAttributes = {
        name: "New Supplier",
        remarks: "Some remarks",
        status: "active",
        address: "123 Supplier St",
        email: "supplier@example.com",
        phone: "123-456-7890",
        identity: "3273",
      };

      jest.clearAllMocks();
      const result = await engine.supplier.create(createData);
      const foundRecord = await engine.supplier.findById(result.id);

      expect(result).toEqual(foundRecord);
      expect(createSpy).toHaveBeenCalledWith(createData);
    });
    it("should throw InvalidEmailException when email is invalid", async () => {
      const createData: SupplierCreationAttributes = {
        name: "New Supplier",
        remarks: "Some remarks",
        status: "active",
        address: "123 Supplier St",
        email: "supplierexample.com",
        phone: "123-456-7890",
        identity: "3273",
      };

      jest.clearAllMocks();
      expect(engine.supplier.create(createData)).rejects.toThrow(
        InvalidEmailException
      );
      expect(createSpy).toHaveBeenCalledTimes(0);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData();
      await supplierFixtures();
    });

    it("should update and return the updated supplier", async () => {
      const id = idGenerator.supplier(1);
      const updateData: SupplierUpdateAttributes = {
        name: "Updated Supplier",
        remarks: "Updated remarks",
        status: "active",
        address: "456 Supplier Ave",
        email: "updated@example.com",
        phone: "987-654-3210",
        identity: "3273",
      };

      const result = await engine.supplier.update(id, updateData);
      const record = await Supplier.findByPk(id, { paranoid: false });

      expect(result).toEqual(record);
    });

    it("should throw InvalidEmailException if email is invalid", async () => {
      const id = idGenerator.supplier(1);
      const updateData: SupplierUpdateAttributes = {
        name: "Updated Supplier",
        remarks: "Updated remarks",
        status: "active",
        address: "456 Supplier Ave",
        email: "updatedexample.com",
        phone: "987-654-3210",
        identity: "3273",
      };

      await expect(engine.supplier.update(id, updateData)).rejects.toThrow(
        InvalidEmailException
      );
    });

    it("should throw SupplierNotFoundException if the supplier is not found", async () => {
      const id = idGenerator.supplier(9999);
      await expect(
        engine.supplier.update(id, {
          name: "Updated Name",
          status: "active",
        })
      ).rejects.toThrow(SupplierNotFoundException);
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData();
      await supplierFixtures();
    });

    it("should delete the supplier", async () => {
      const id = idGenerator.supplier(1);
      await engine.supplier.delete(id);

      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
      const record = await Supplier.findByPk(id);
      expect(record).toBeNull();
      const paranoidRecord = await Supplier.findByPk(id, { paranoid: false });
      expect(paranoidRecord?.deletedAt).toBeDefined();
      expect(paranoidRecord?.status).toStrictEqual("deleted");
    });

    it("should throw SupplierNotFoundException if the supplier is not found", async () => {
      const id = idGenerator.supplier(9999);

      await expect(engine.supplier.delete(id)).rejects.toThrow(
        SupplierNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });
});
