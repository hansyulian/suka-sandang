import { Op } from "sequelize";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import { Material } from "~/models/Material";
import { MaterialFacade } from "~/facades/MaterialFacade";
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
import { checkStrayValues } from "~test/utils/checkStrayValues";

describe("MaterialFacade", () => {
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
          status: {
            [Op.ne]: "deleted",
          },
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Material.findAndCountAll(findOptions);
      jest.clearAllMocks();

      const result = await MaterialFacade.list(query, mockOptions);
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
          status: {
            [Op.ne]: "deleted",
          },
          ...query,
        },
        ...mockOptions,
      };
      const expectedResult = await Material.findAndCountAll(findOptions);
      jest.clearAllMocks();
      const result = await MaterialFacade.list(query, mockOptions);
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
      const result = await MaterialFacade.findById(id);

      expect(result).toEqual(material);
      expect(findByPkSpy).toHaveBeenCalledWith(id);
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const id = idGenerator.material(9999);

      await expect(MaterialFacade.findById(id)).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(findByPkSpy).toHaveBeenCalledWith(id);
    });
  });
  describe("findByIdOrCode", () => {
    beforeAll(async () => {
      await resetData();
      await materialFixtures();
    });
    it("should return the material if found when using code", async () => {
      const code = "material-01";
      const record = await Material.findOne({ where: { code } });
      jest.clearAllMocks();

      const result = await MaterialFacade.findByIdOrCode(code);

      expect(result).toEqual(record);
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { code },
      });
    });
    it("should return the material if found when using id", async () => {
      const id = idGenerator.material(1);
      const material = await Material.findByPk(id);
      jest.clearAllMocks();
      const result = await MaterialFacade.findByIdOrCode(id);

      expect(result).toEqual(material);
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } });
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const code = "materia-01";
      const record = await Material.findOne({ where: { code } });
      jest.clearAllMocks();

      await expect(MaterialFacade.findByIdOrCode(code)).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { code },
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
      const result = await MaterialFacade.create(createData);
      const foundRecord = await MaterialFacade.findByIdOrCode(
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
      const result = await MaterialFacade.create(injectStrayValues(createData));
      const foundRecord = await MaterialFacade.findByIdOrCode(
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
      await expect(MaterialFacade.create(createData)).rejects.toThrow(
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
      const result = await MaterialFacade.update(id, updateData);
      const record = await Material.findByPk(id);

      expect(result).toEqual(record);
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const id = idGenerator.material(199);
      await expect(
        MaterialFacade.update(id, {
          name: "Updated Name",
          code: "Updated Code",
          status: "pending",
        })
      ).rejects.toThrow(MaterialNotFoundException);
      expect(Material.findByPk).toHaveBeenCalledWith(id);
    });
    it("should throw MaterialDuplicationException if the material code exists", async () => {
      const id = idGenerator.material(1);
      await expect(
        MaterialFacade.update(id, {
          name: "Updated Name",
          code: "material-02",
          status: "pending",
        })
      ).rejects.toThrow(MaterialDuplicationException);
      expect(Material.findByPk).toHaveBeenCalledWith(id);
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
      const result = await MaterialFacade.update(id, updateData);
      const record = await Material.findByPk(id);

      expect(result).toEqual(record);
    });
  });

  describe("remove", () => {
    beforeEach(async () => {
      await resetData();
      await materialFixtures();
    });

    it("should delete the material", async () => {
      const id = idGenerator.material(1);
      await MaterialFacade.delete(id);

      expect(Material.findByPk).toHaveBeenCalledWith(id);
      const record = await Material.findByPk(id);
      expect(record).toBeNull();
      const paranoidRecord = await Material.findByPk(id, { paranoid: false });
      expect(paranoidRecord?.deletedAt).toBeDefined();
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      const id = idGenerator.material(199);

      await expect(MaterialFacade.delete(id)).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(Material.findByPk).toHaveBeenCalledWith(id);
    });
  });
});
