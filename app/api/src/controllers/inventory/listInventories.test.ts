import { InventoryEngine, Material } from "@app/core";
import { extractQueryParameters } from "~/utils/extractQueryParemeters";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";
import { apiTest, checkStrayValues, injectStrayValues } from "~test/utils";

describe("Controller: listInventoriesController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/inventory");
  });

  it("should call Inventory facade list function", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    InventoryEngine.prototype.list = jest.fn().mockResolvedValueOnce(
      injectStrayValues({
        records: [
          injectStrayValues({
            id: id,
            code: "sample-inventory-1",
            createdAt: now,
            status: "draft",
            updatedAt: now,
            deletedAt: now,
            material: injectStrayValues({
              id: "mock-material-id",
              name: "Material Name",
              createdAt: now,
              updatedAt: now,
              deletedAt: now,
            }),
          }),
        ],
        count: 1,
      })
    );

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory`)
      .send();

    expect(InventoryEngine.prototype.list).toHaveBeenCalledWith(
      {},
      extractQueryParameters({})
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    checkStrayValues(body);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: id,
      code: "sample-inventory-1",
      status: "draft",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      material: {
        id: "mock-material-id",
        name: "Material Name",
        createdAt: nowString,
        updatedAt: nowString,
        deletedAt: nowString,
      },
    });
  });

  it("should handle queries", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    InventoryEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-inventory-1",
          createdAt: now,
          status: "draft",
          updatedAt: now,
          deletedAt: now,
          material: {
            id: "mock-material-id",
            name: "Material Name",
            createdAt: now,
            updatedAt: now,
            deletedAt: now,
          },
        },
      ],
      count: 1,
    });

    const query = {
      code: "sample-inventory",
    };

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory`)
      .query(injectStrayValues(query))
      .send();

    expect(InventoryEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery(query),
      extractQueryParameters({})
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: id,
      code: "sample-inventory-1",
      status: "draft",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      material: {
        id: "mock-material-id",
        name: "Material Name",
        createdAt: nowString,
        updatedAt: nowString,
        deletedAt: nowString,
      },
    });
  });

  it("should handle search query", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    InventoryEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-inventory-1",
          createdAt: now,
          status: "draft",
          updatedAt: now,
          deletedAt: now,
          material: {
            id: "mock-material-id",
            name: "Material Name",
            createdAt: now,
            updatedAt: now,
            deletedAt: now,
          },
        },
      ],
      count: 1,
    });

    const query = {
      search: "sample-inventory",
    };

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory`)
      .query(injectStrayValues(query))
      .send();

    expect(InventoryEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery({
        code: query.search,
      }),
      extractQueryParameters({})
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: id,
      code: "sample-inventory-1",
      status: "draft",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      material: {
        id: "mock-material-id",
        name: "Material Name",
        createdAt: nowString,
        updatedAt: nowString,
        deletedAt: nowString,
      },
    });
  });

  it("should handle 'orderBy' query for materialName", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    InventoryEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-inventory-1",
          createdAt: now,
          status: "draft",
          updatedAt: now,
          deletedAt: now,
          material: {
            id: "mock-material-id",
            name: "Material Name",
            createdAt: now,
            updatedAt: now,
            deletedAt: now,
          },
        },
      ],
      count: 1,
    });

    const query = {
      orderBy: "materialName",
      orderDirection: "asc",
    };

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory`)
      .query(injectStrayValues(query))
      .send();

    expect(InventoryEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery({}),
      {
        order: [[{ model: Material, as: "material" }, "name", "asc"]],
      }
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: id,
      code: "sample-inventory-1",
      status: "draft",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      material: {
        id: "mock-material-id",
        name: "Material Name",
        createdAt: nowString,
        updatedAt: nowString,
        deletedAt: nowString,
      },
    });
  });

  it("should handle 'orderBy' query for materialCode", async () => {
    const id = "mock-id";
    const now = new Date();
    const nowString = now.toISOString();

    InventoryEngine.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [
        {
          id: id,
          code: "sample-inventory-1",
          createdAt: now,
          status: "draft",
          updatedAt: now,
          deletedAt: now,
          material: {
            id: "mock-material-id",
            name: "Material Name",
            createdAt: now,
            updatedAt: now,
            deletedAt: now,
          },
        },
      ],
      count: 1,
    });

    const query = {
      orderBy: "materialCode",
      orderDirection: "desc",
    };

    const response = await apiTest
      .withAuthentication()
      .get(`/inventory`)
      .query(injectStrayValues(query))
      .send();

    expect(InventoryEngine.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery({}),
      {
        order: [[{ model: Material, as: "material" }, "code", "desc"]],
      }
    );

    const { body, status } = response;
    expect(status).toStrictEqual(200);
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);

    const firstRecord = body.records[0];
    checkStrayValues(firstRecord);

    expect(firstRecord).toEqual({
      id: id,
      code: "sample-inventory-1",
      status: "draft",
      createdAt: nowString,
      updatedAt: nowString,
      deletedAt: nowString,
      material: {
        id: "mock-material-id",
        name: "Material Name",
        createdAt: nowString,
        updatedAt: nowString,
        deletedAt: nowString,
      },
    });
  });
});
