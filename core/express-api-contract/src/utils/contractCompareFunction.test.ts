import { contractCompareFunction } from "~/utils/contractCompareFunction";

describe("contractCompareFunction", () => {
  it("should sort path correctly 1", () => {
    const array = [
      {
        contractPath: "/material/options",
      },
      {
        contractPath: "/material",
      },
      {
        contractPath: "/material/:id",
      },
    ] as any;
    array.sort(contractCompareFunction);
    expect(array).toEqual([
      {
        contractPath: "/material",
      },
      {
        contractPath: "/material/options",
      },
      {
        contractPath: "/material/:id",
      },
    ]);
  });
  it("should sort path correctly 2", () => {
    const array = [
      {
        contractPath: "/customer/:idOrCode",
      },
      {
        contractPath: "/material/options",
      },
      {
        contractPath: "/customer/options",
      },
      {
        contractPath: "/supplier",
      },
      {
        contractPath: "/material",
      },
      {
        contractPath: "/material/:id",
      },
      {
        contractPath: "/customer",
      },
    ] as any;
    array.sort(contractCompareFunction);
    expect(array).toEqual([
      {
        contractPath: "/customer",
      },
      {
        contractPath: "/customer/options",
      },
      {
        contractPath: "/customer/:idOrCode",
      },
      {
        contractPath: "/material",
      },
      {
        contractPath: "/material/options",
      },
      {
        contractPath: "/material/:id",
      },
      {
        contractPath: "/supplier",
      },
    ]);
  });
});
