import { Op } from "sequelize";
import { CustomerNotFoundException } from "~/exceptions/CustomerNotFoundException";
import { Customer } from "~/models";
import {
  CustomerCreationAttributes,
  CustomerUpdateAttributes,
} from "@app/common";
import { resetData } from "~test/utils/resetData";
import { idGenerator } from "~test/utils/idGenerator";
import { Engine } from "~/CoreEngine";
import { InvalidEmailException } from "~/exceptions/InvalidEmailException";
import { customerFixtures } from "~test/fixtures/customerFixtures";

describe("CustomerEngine", () => {
  const engine = new Engine();
  const findAndCountAllSpy = jest.spyOn(Customer, "findAndCountAll");
  const findByPkSpy = jest.spyOn(Customer, "findByPk");

  describe("list", () => {
    beforeAll(async () => {
      await resetData();
      await customerFixtures();
    });

    it("should return the count and records of customers", async () => {
      const query = {};
      const mockOptions = {};
      const findOptions = {
        where: {
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Customer.findAndCountAll(findOptions);
      jest.clearAllMocks();

      const result = await engine.customer.list(query, mockOptions);
      expect(findAndCountAllSpy).toHaveBeenCalledWith(findOptions);
      expect(result).toEqual({
        count: expectedResult.count,
        records: expectedResult.rows,
      });
    });

    it("should return the count and records of customers with query", async () => {
      const query = {
        name: {
          [Op.like]: "%Customer 1%",
        },
      };
      const mockOptions = {};
      const findOptions = {
        where: {
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Customer.findAndCountAll(findOptions);
      jest.clearAllMocks();
      const result = await engine.customer.list(query, mockOptions);
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
      await customerFixtures();
    });

    it("should return the customer if found", async () => {
      const id = idGenerator.customer(1);
      const customer = await Customer.findByPk(id);
      jest.clearAllMocks();
      const result = await engine.customer.findById(id);

      expect(result).toEqual(customer);
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });

    it("should throw CustomerNotFoundException if the customer is not found", async () => {
      const id = idGenerator.customer(9999);

      await expect(engine.customer.findById(id)).rejects.toThrow(
        CustomerNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData();
      await customerFixtures();
    });

    it("should create and return a new customer", async () => {
      const createData: CustomerCreationAttributes = {
        name: "New Customer",
        remarks: "Some remarks",
        status: "active",
        address: "123 Customer St",
        email: "customer@example.com",
        phone: "123-456-7890",
        identity: "3273",
      };

      jest.clearAllMocks();
      const result = await engine.customer.create(createData);
      const foundRecord = await engine.customer.findById(result.id);

      expect(result).toEqual(foundRecord);
    });
    it("should throw InvalidEmailException when email is invalid", async () => {
      const createData: CustomerCreationAttributes = {
        name: "New Customer",
        remarks: "Some remarks",
        status: "active",
        address: "123 Customer St",
        email: "customerexample.com",
        phone: "123-456-7890",
        identity: "3273",
      };

      jest.clearAllMocks();
      expect(engine.customer.create(createData)).rejects.toThrow(
        InvalidEmailException
      );
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData();
      await customerFixtures();
    });

    it("should update and return the updated customer", async () => {
      const id = idGenerator.customer(1);
      const updateData: CustomerUpdateAttributes = {
        name: "Updated Customer",
        remarks: "Updated remarks",
        status: "active",
        address: "456 Customer Ave",
        email: "updated@example.com",
        phone: "987-654-3210",
        identity: "3273",
      };

      const result = await engine.customer.update(id, updateData);
      const record = await Customer.findByPk(id, { paranoid: false });

      expect(result).toEqual(record);
    });

    it("should throw InvalidEmailException if email is invalid", async () => {
      const id = idGenerator.customer(1);
      const updateData: CustomerUpdateAttributes = {
        name: "Updated Customer",
        remarks: "Updated remarks",
        status: "active",
        address: "456 Customer Ave",
        email: "updatedexample.com",
        phone: "987-654-3210",
        identity: "3273",
      };

      await expect(engine.customer.update(id, updateData)).rejects.toThrow(
        InvalidEmailException
      );
    });

    it("should throw CustomerNotFoundException if the customer is not found", async () => {
      const id = idGenerator.customer(9999);
      await expect(
        engine.customer.update(id, {
          name: "Updated Name",
          status: "active",
        })
      ).rejects.toThrow(CustomerNotFoundException);
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });

  describe("delete", () => {
    beforeEach(async () => {
      await resetData();
      await customerFixtures();
    });

    it("should delete the customer", async () => {
      const id = idGenerator.customer(1);
      await engine.customer.delete(id);

      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
      const record = await Customer.findByPk(id);
      expect(record).toBeNull();
      const paranoidRecord = await Customer.findByPk(id, { paranoid: false });
      expect(paranoidRecord?.deletedAt).toBeDefined();
      expect(paranoidRecord?.status).toStrictEqual("deleted");
    });

    it("should throw CustomerNotFoundException if the customer is not found", async () => {
      const id = idGenerator.customer(9999);

      await expect(engine.customer.delete(id)).rejects.toThrow(
        CustomerNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });
});
