import { Op } from "sequelize";
import { MaterialNotFoundException } from "~/exceptions/MaterialNotFoundException";
import {
  Material,
  MaterialCreationAttributes,
  MaterialUpdateAttributes,
} from "~/models/Material";
import { processQueryOptions } from "~/utils";
import { MaterialFacade } from "~/facades/MaterialFacade";
import { QueryOptions } from "~/types";

jest.mock("~/models/Material", () => ({
  Material: {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
}));

jest.mock("~/utils", () => ({
  processQueryOptions: jest.fn(),
}));

describe("MaterialFacade", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("list", () => {
    it("should return the count and records of materials", async () => {
      // Arrange
      const mockQuery = { code: "ABC" };
      const mockOptions: QueryOptions = { limit: 10, offset: 0 };
      const mockResult = {
        count: 2,
        rows: [
          {
            id: "1",
            code: "ABC",
            name: "Material 1",
            purchasePrice: 100,
            retailPrice: 150,
          },
          {
            id: "2",
            code: "DEF",
            name: "Material 2",
            purchasePrice: 200,
            retailPrice: 250,
          },
        ],
      };
      (Material.findAndCountAll as jest.Mock).mockResolvedValue(mockResult);
      (processQueryOptions as jest.Mock).mockReturnValue(mockOptions);

      // Act
      const result = await MaterialFacade.list(mockQuery, mockOptions);

      // Assert
      expect(result).toEqual({
        count: mockResult.count,
        records: mockResult.rows,
      });
      expect(Material.findAndCountAll).toHaveBeenCalledWith({
        where: {
          status: {
            [Op.ne]: "deleted",
          },
          ...mockQuery,
        },
        ...mockOptions,
      });
    });
  });

  describe("findById", () => {
    it("should return the material if found", async () => {
      // Arrange
      const mockMaterial = {
        id: "1",
        code: "ABC",
        name: "Material 1",
        purchasePrice: 100,
        retailPrice: 150,
      };
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);

      // Act
      const result = await MaterialFacade.findById("1");

      // Assert
      expect(result).toEqual(mockMaterial);
      expect(Material.findByPk).toHaveBeenCalledWith("1");
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      // Arrange
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(MaterialFacade.findById("1")).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(Material.findByPk).toHaveBeenCalledWith("1");
    });
  });

  describe("create", () => {
    it("should create and return a new material", async () => {
      // Arrange
      const mockData: MaterialCreationAttributes = {
        code: "ABC",
        name: "Material 1",
        purchasePrice: 100,
        retailPrice: 150,
      };
      const mockMaterial = { ...mockData, id: "1" };
      (Material.create as jest.Mock).mockResolvedValue(mockMaterial);

      // Act
      const result = await MaterialFacade.create(mockData);

      // Assert
      expect(result).toEqual(mockMaterial);
      expect(Material.create).toHaveBeenCalledWith(mockData);
    });
    it("should create and return a new material and ignore stray values", async () => {
      // Arrange
      const mockData: MaterialCreationAttributes = {
        code: "ABC",
        name: "Material 1",
        purchasePrice: 100,
        retailPrice: 150,
      };
      const mockMaterial = { ...mockData, id: "1" };
      (Material.create as jest.Mock).mockResolvedValue(mockMaterial);

      // Act
      const result = await MaterialFacade.create({
        ...mockData,
        a: "stray value",
        b: "stray value",
      } as any);

      // Assert
      expect(result).toEqual(mockMaterial);
      expect(Material.create).toHaveBeenCalledWith(mockData);
    });
  });

  describe("update", () => {
    it("should update and return the updated material", async () => {
      // Arrange
      const mockMaterial = {
        id: "1",
        code: "ABC",
        name: "Material 1",
        purchasePrice: 100,
        retailPrice: 150,
        update: jest.fn().mockResolvedValue({
          id: "1",
          code: "XYZ",
          name: "Material Updated",
          purchasePrice: 120,
          retailPrice: 170,
        }),
      };
      const updateData: MaterialUpdateAttributes = {
        code: "XYZ",
        name: "Material Updated",
        purchasePrice: 120,
        retailPrice: 170,
      };
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);

      // Act
      const result = await MaterialFacade.update("1", updateData);

      // Assert
      expect(result).toEqual({
        id: "1",
        code: "XYZ",
        name: "Material Updated",
        purchasePrice: 120,
        retailPrice: 170,
      });
      expect(Material.findByPk).toHaveBeenCalledWith("1");
      expect(mockMaterial.update).toHaveBeenCalledWith(updateData);
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      // Arrange
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(
        MaterialFacade.update("1", { name: "Updated Name" })
      ).rejects.toThrow(MaterialNotFoundException);
      expect(Material.findByPk).toHaveBeenCalledWith("1");
    });
  });

  describe("remove", () => {
    it("should delete the material", async () => {
      // Arrange
      const mockMaterial = {
        id: "1",
        code: "ABC",
        name: "Material 1",
        purchasePrice: 100,
        retailPrice: 150,
        destroy: jest.fn(),
      };
      (Material.findByPk as jest.Mock).mockResolvedValue(mockMaterial);

      // Act
      await MaterialFacade.delete("1");

      // Assert
      expect(Material.findByPk).toHaveBeenCalledWith("1");
      expect(mockMaterial.destroy).toHaveBeenCalled();
    });

    it("should throw MaterialNotFoundException if the material is not found", async () => {
      // Arrange
      (Material.findByPk as jest.Mock).mockResolvedValue(null);

      // Act & Assert
      await expect(MaterialFacade.delete("1")).rejects.toThrow(
        MaterialNotFoundException
      );
      expect(Material.findByPk).toHaveBeenCalledWith("1");
    });
  });
});
