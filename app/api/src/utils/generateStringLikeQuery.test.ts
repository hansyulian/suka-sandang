import { Op } from "@app/core";
import { generateStringLikeQuery } from "~/utils/generateStringLikeQuery";

describe("generateStringLikeQuery", () => {
  it("should generate a query with multiple conditions using iLike", () => {
    const query = {
      name: "John",
      email: "john@example.com",
    };

    const result = generateStringLikeQuery(query);

    expect(result).toEqual({
      [Op.or]: [
        { name: { [Op.iLike]: "%John%" } },
        { email: { [Op.iLike]: "%john@example.com%" } },
      ],
    });
  });

  it("should handle an empty query object", () => {
    const query = {};

    const result = generateStringLikeQuery(query);

    expect(result).toEqual({});
  });

  it("should ignore undefined or null values in the query", () => {
    const query = {
      name: "John",
      email: null,
      phone: undefined,
    };

    const result = generateStringLikeQuery(query);

    expect(result).toEqual({
      [Op.or]: [{ name: { [Op.iLike]: "%John%" } }],
    });
  });

  it("should return an empty object if all query values are undefined or null", () => {
    const query = {
      name: undefined,
      email: null,
    };

    const result = generateStringLikeQuery(query);

    expect(result).toEqual({});
  });

  it("should handle a single valid query key", () => {
    const query = {
      name: "John",
    };

    const result = generateStringLikeQuery(query);

    expect(result).toEqual({
      [Op.or]: [{ name: { [Op.iLike]: "%John%" } }],
    });
  });

  it("should handle special characters in query values", () => {
    const query = {
      name: "John_Doe",
    };

    const result = generateStringLikeQuery(query);

    expect(result).toEqual({
      [Op.or]: [{ name: { [Op.iLike]: "%John_Doe%" } }],
    });
  });
});
