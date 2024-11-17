import type {
  MaterialCreationAttributes,
  UserCreationAttributes,
} from "@app/common";
import { Engine } from "~/CoreEngine";
import { EngineBase } from "~/engine/EngineBase";
import { Material, User } from "~/models";
import { WithTransaction } from "~/modules/WithTransactionDecorator";
import { resetData } from "~test/utils/resetData";

class SampleEngine extends EngineBase {
  @WithTransaction
  public async testSuccess(data: UserCreationAttributes) {
    const result = await User.create(data);
    return result;
  }

  @WithTransaction
  public async testNestedSuccess(
    userData: UserCreationAttributes,
    materialData: MaterialCreationAttributes
  ) {
    const user = await User.create(userData);
    const material = await this.testSuccessMaterial(materialData);
    return { user, material };
  }
  @WithTransaction
  public async testSuccessThenFail(
    userData: UserCreationAttributes,
    materialData: MaterialCreationAttributes
  ) {
    const user = await User.create(userData);
    const material = await this.testFailMaterial(user.id, materialData);
    return { user, material };
  }

  @WithTransaction
  public async testSuccessMaterial(data: MaterialCreationAttributes) {
    return Material.create(data);
  }
  @WithTransaction
  public async testFailMaterial(
    userId: string,
    data: MaterialCreationAttributes
  ) {
    const user = await User.findByPk(userId); // ensure user is exists
    if (!user) {
      throw new Error("UserNotFound");
    }
    await Material.create(data);
    throw new Error("MaterialThrow");
  }

  @WithTransaction
  public async testRollback(data: UserCreationAttributes) {
    await User.create(data);
    throw new Error("sample error");
  }
}

class TestEngine extends Engine {
  public sample: SampleEngine;

  constructor() {
    super();
    this.sample = new SampleEngine(this);
  }
}

describe("testing", () => {
  const engine = new TestEngine();
  beforeEach(async () => {
    await resetData();
  });
  it("should be able to commit a set of transaction", async () => {
    const data: UserCreationAttributes = {
      email: "success-test@test.com",
      name: "Sample success test name",
      password: "123123123",
    };
    const result = await engine.sample.testSuccess(data);
    const foundRecord = await User.findByPk(result.id);
    expect(foundRecord?.email).toStrictEqual(data.email);
    expect(foundRecord?.name).toStrictEqual(data.name);
  });
  it("should be able to rollback a set of transaction", async () => {
    const data: UserCreationAttributes = {
      email: "test-rollback@test.com",
      name: "Sample rollback test name",
      password: "123123123",
    };
    expect(engine.sample.testRollback(data)).rejects.toThrow(Error);
    const foundRecords = await User.findAll();
    expect(foundRecords).toHaveLength(0);
  });
  it("should be able to handle nested success", async () => {
    const userData: UserCreationAttributes = {
      email: "success-test@test.com",
      name: "Sample success test name",
      password: "123123123",
    };
    const materialData: MaterialCreationAttributes = {
      code: "Material-code-1",
      name: "Material 1",
    };
    const { user, material } = await engine.sample.testNestedSuccess(
      userData,
      materialData
    );
    const foundUser = await User.findByPk(user.id);
    expect(foundUser).toBeDefined();
    const foundMaterial = await Material.findByPk(material.id);
    expect(foundMaterial).toBeDefined();
  });
  it("should be able to handle inner failure", async () => {
    const userData: UserCreationAttributes = {
      email: "success-test@test.com",
      name: "Sample success test name",
      password: "123123123",
    };
    const materialData: MaterialCreationAttributes = {
      code: "Material-code-1",
      name: "Material 1",
    };
    expect(
      engine.sample.testSuccessThenFail(userData, materialData)
    ).rejects.toThrow("MaterialThrow");
    const foundUsers = await User.findAll();
    expect(foundUsers).toHaveLength(0);
    const foundMaterials = await Material.findAll();
    expect(foundMaterials).toHaveLength(0);
  });
});
