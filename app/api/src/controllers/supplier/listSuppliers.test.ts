import { SupplierAttributes } from "@app/common";
import { SupplierFacade } from "@app/engine";
import { extractQueryParameters, generateStringLikeQuery } from "~/utils";
import { apiTest, injectStrayValues } from "~test/utils";

describe("Controller: listSuppliersController", () => {
  it("should require authentication", async () => {
    await apiTest.testRequireAuthentication().get("/supplier");
  });
  it("should call supplier facade list function", async () => {
    const id = "mock-id";
    const record: SupplierAttributes = {
      id,
      name: "Supplier 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    };
    SupplierFacade.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [record],
      count: 1,
    });
    const response = await apiTest.withAuthentication().get(`/supplier`).send();

    expect(SupplierFacade.prototype.list).toHaveBeenCalledWith(
      {},
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.name).toStrictEqual("Supplier 1");
    expect(firstRecord.email).toStrictEqual("email@example.com");
    expect(firstRecord.address).toStrictEqual("Address");
    expect(firstRecord.phone).toStrictEqual("+62123123123");
    expect(firstRecord.remarks).toStrictEqual("remarks");
    expect(firstRecord.status).toStrictEqual("active");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
  it("should handle queries", async () => {
    const id = "mock-id";
    const record: SupplierAttributes = {
      id,
      name: "Supplier 1",
      address: "Address",
      email: "email@example.com",
      phone: "+62123123123",
      remarks: "remarks",
      createdAt: new Date(),
      status: "active",
      updatedAt: new Date(),
    };
    SupplierFacade.prototype.list = jest.fn().mockResolvedValueOnce({
      records: [record],
      count: 1,
    });
    const query = {
      search: "search",
    };
    const response = await apiTest
      .withAuthentication()
      .get(`/supplier`)
      .query(injectStrayValues(query))
      .send();

    expect(SupplierFacade.prototype.list).toHaveBeenCalledWith(
      generateStringLikeQuery({
        name: query.search,
        address: query.search,
        phone: query.search,
        email: query.search,
        remarks: query.search,
      }),
      extractQueryParameters({})
    );
    const { body } = response;
    expect(body.info).toEqual({ count: 1 });
    expect(body.records.length).toStrictEqual(1);
    const firstRecord = body.records[0];
    expect(firstRecord.id).toStrictEqual(id);
    expect(firstRecord.name).toStrictEqual("Supplier 1");
    expect(firstRecord.email).toStrictEqual("email@example.com");
    expect(firstRecord.address).toStrictEqual("Address");
    expect(firstRecord.phone).toStrictEqual("+62123123123");
    expect(firstRecord.remarks).toStrictEqual("remarks");
    expect(firstRecord.status).toStrictEqual("active");
    expect(firstRecord.createdAt).toBeDefined();
    expect(firstRecord.updatedAt).toBeDefined();
    expect(firstRecord.deletedAt).toBeUndefined();
  });
});
