import { Op } from "sequelize";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import { Material } from "~/models/Material";
import {
  MaterialCreationAttributes,
  MaterialUpdateAttributes,
} from "@app/common";
import { initializeDatabase } from "~test/utils/initializeDatabase";
import { resetData } from "~test/utils/resetData";
import { materialFixtures } from "~test/fixtures/materialFixtures";
import { idGenerator } from "~test/utils/idGenerator";
import { injectStrayValues } from "~test/utils/injectStrayValues";
import { MaterialDuplicationException } from "~/exceptions/MaterialDuplicationException";
import { Engine } from "~/Engine";

describe("MaterialFacade", () => {
  const engine = new Engine();
  const findAndCountAllSpy = jest.spyOn(Material, "findAndCountAll");
  const findByPkSpy = jest.spyOn(Material, "findByPk");
  const createSpy = jest.spyOn(Material, "create");
  const findOneSpy = jest.spyOn(Material, "findOne");
  beforeAll(async () => {
    await initializeDatabase();
  });

  describe("list", () => {
    beforeAll(async () => {
      await resetData();
      await materialFixtures();
    });
    it("should return the count and records of materials", async () => {
      const query = {};
      const mockOptions = {};
      const findOptions = {
        where: {
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Material.findAndCountAll(findOptions);
      jest.clearAllMocks();

      const result = await engine.material.list(query, mockOptions);
      expect(findAndCountAllSpy).toHaveBeenCalledWith(findOptions);

      expect(result).toEqual({
        count: expectedResult.count,
        records: expectedResult.rows,
      });
    });
    it("should return the count and records of materials with query", async () => {
      const query = {
        name: {
          [Op.like]: "%1%",
        },
      };
      const mockOptions = {};
      const findOptions = {
        where: {
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Material.findAndCountAll(findOptions);
      jest.clearAllMocks();
      const result = await engine.material.list(query, mockOptions);
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
      await materialFixtures();
    });
    it("should return the material if found", async () => {
      const id = idGenerator.material(1);
      const material = await Material.findByPk(id);
      jest.clearAllMocks();
      const result = await engine.material.findById(id);

      expect(result).toEqual(material);
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const id = idGenerator.material(9999);

      await expect(engine.material.findById(id)).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });

    it("should allow finding deleted material", async () => {
      const id = idGenerator.material(100);
      jest.clearAllMocks();
      const record = await engine.material.findById(id);
      expect(record).toBeDefined();
      expect(record.deletedAt).toBeDefined();
      expect(findByPkSpy).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });
  describe("findByIdOrCode", () => {
    beforeAll(async () => {
      await resetData();
      await materialFixtures();
    });
    it("should return the material if found when using code", async () => {
      const code = "material-01";
      const record = await Material.findOne({
        where: { code },
        paranoid: false,
      });
      jest.clearAllMocks();

      const result = await engine.material.findByIdOrCode(code);

      expect(result).toEqual(record);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { code },
        paranoid: false,
      });
    });
    it("should return the material if found when using id", async () => {
      const id = idGenerator.material(1);
      const material = await Material.findByPk(id, { paranoid: false });
      jest.clearAllMocks();
      const result = await engine.material.findByIdOrCode(id);

      expect(result).toEqual(material);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id },
        paranoid: false,
      });
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const code = "materia-01";
      const record = await Material.findOne({
        where: { code },
        paranoid: false,
      });
      jest.clearAllMocks();

      await expect(engine.material.findByIdOrCode(code)).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { code },
        paranoid: false,
      });
    });

    it("should allow finding deleted material", async () => {
      const code = "deleted-material-test";
      jest.clearAllMocks();
      const record = await engine.material.findByIdOrCode(code);
      expect(record).toBeDefined();
      expect(record.deletedAt).toBeDefined();
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { code },
        paranoid: false,
      });
    });
  });

  describe("create", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
    });
    it("should create and return a new material", async () => {
      const createData: MaterialCreationAttributes = {
        code: "my-new-material",
        name: "My new material",
        purchasePrice: 100,
        retailPrice: 150,
        status: "pending",
      };

      jest.clearAllMocks();
      const result = await engine.material.create(createData);
      const foundRecord = await engine.material.findByIdOrCode(
        "my-new-material"
      );

      expect(result).toEqual(foundRecord);
      expect(createSpy).toHaveBeenCalledWith(createData);
    });
    it("should create and return a new material and ignore stray values", async () => {
      const createData: MaterialCreationAttributes = {
        code: "my-new-material",
        name: "My new material",
        purchasePrice: 100,
        retailPrice: 150,
        status: "pending",
      };
      jest.clearAllMocks();
      const result = await engine.material.create(
        injectStrayValues(createData)
      );
      const foundRecord = await engine.material.findByIdOrCode(
        "my-new-material"
      );

      expect(result).toEqual(foundRecord);
      expect(createSpy).toHaveBeenCalledWith(createData);
    });
    it("should throw duplicated material if code already exists", async () => {
      const createData: MaterialCreationAttributes = {
        code: "material-01",
        name: "My new material",
        purchasePrice: 100,
        retailPrice: 150,
        status: "pending",
      };
      jest.clearAllMocks();
      await expect(engine.material.create(createData)).rejects.toThrow(
        MaterialDuplicationException
      );
      expect(Material.create).toHaveBeenCalledTimes(0);
    });
  });

  describe("update", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
    });
    it("should update and return the updated material", async () => {
      const id = idGenerator.material(1);
      const updateData: MaterialUpdateAttributes = {
        code: "XYZ",
        name: "Material Updated",
        purchasePrice: 120,
        retailPrice: 170,
        status: "active",
        color: "#ffffff",
      };
      const result = await engine.material.update(id, updateData);
      const record = await Material.findByPk(id);

      expect(result).toEqual(record);
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const id = idGenerator.material(199);
      await expect(
        engine.material.update(id, {
          name: "Updated Name",
          code: "Updated Code",
          status: "pending",
        })
      ).rejects.toThrow(MaterialNotFoundException);
      expect(Material.findByPk).toHaveBeenCalledWith(id, { paranoid: false });
    });
    it("should throw MaterialDuplicationException if the material code exists", async () => {
      const id = idGenerator.material(1);
      await expect(
        engine.material.update(id, {
          name: "Updated Name",
          code: "material-02",
          status: "pending",
        })
      ).rejects.toThrow(MaterialDuplicationException);
      expect(Material.findByPk).toHaveBeenCalledWith(id, { paranoid: false });
    });
    it("should be fine if the material code inputted is it's own code", async () => {
      const id = idGenerator.material(1);
      const updateData: MaterialUpdateAttributes = {
        code: "material-01",
        name: "Material Updated",
        purchasePrice: 120,
        retailPrice: 170,
        status: "active",
        color: "#ffffff",
      };
      const result = await engine.material.update(id, updateData);
      const record = await Material.findByPk(id);

      expect(result).toEqual(record);
    });

    it("should be able to update deleted material, if the status got changed, it will be restored", async () => {
      const id = idGenerator.material(100);

      const updateData: MaterialUpdateAttributes = {
        name: "Material Restored",
        status: "active",
      };
      const result = await engine.material.update(id, updateData);
      const record = await Material.findByPk(id, { paranoid: false });
      expect(record?.deletedAt).toBeNull();
      expect(record?.status).toStrictEqual(updateData.status);
      expect(record?.name).toStrictEqual(updateData.name);
      expect(result?.deletedAt).toBeNull();
      expect(result?.status).toStrictEqual(updateData.status);
      expect(result?.name).toStrictEqual(updateData.name);
    });

    it("should be able to update deleted material, without restoring the record", async () => {
      const id = idGenerator.material(100);

      const updateData: MaterialUpdateAttributes = {
        name: "Material Restored",
        color: "#388388",
      };
      const result = await engine.material.update(id, updateData);
      const record = await Material.findByPk(id, { paranoid: false });
      expect(record?.deletedAt).toBeDefined();
      expect(record?.status).toStrictEqual("deleted");
      expect(record?.color).toStrictEqual(updateData.color);
      expect(record?.name).toStrictEqual(updateData.name);
      expect(result?.deletedAt).toBeDefined();
      expect(result?.status).toStrictEqual("deleted");
      expect(result?.color).toStrictEqual(updateData.color);
      expect(result?.name).toStrictEqual(updateData.name);
    });
  });

  describe("remove", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
    });

    it("should delete the material", async () => {
      const id = idGenerator.material(1);
      await engine.material.delete(id);

      expect(Material.findByPk).toHaveBeenCalledWith(id, { paranoid: false });
      const record = await Material.findByPk(id);
      expect(record).toBeNull();
      const paranoidRecord = await Material.findByPk(id, { paranoid: false });
      expect(paranoidRecord?.deletedAt).toBeDefined();
      expect(paranoidRecord?.status).toStrictEqual("deleted");
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const id = idGenerator.material(199);

      await expect(engine.material.delete(id)).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(Material.findByPk).toHaveBeenCalledWith(id, { paranoid: false });
    });
  });
});
