import { Engine } from "~/Engine";
import { TransactionManager } from "~/modules/TransactionManager";

// Mocking the Engine class
jest.mock("~/Engine", () => {
  return {
    Engine: jest.fn().mockImplementation(() => ({
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      transaction: "mocked_transaction",
    })),
  };
});

describe("TransactionManager", () => {
  let engineMock: jest.Mocked<Engine>;
  let transactionManager: TransactionManager;

  beforeEach(() => {
    // Create a new mock instance for each test
    engineMock = new Engine() as jest.Mocked<Engine>;
  });

  describe("isMaster getter", () => {
    it("should return true when master is true", () => {
      transactionManager = new TransactionManager(engineMock, true);
      expect(transactionManager.isMaster).toBe(true);
    });

    it("should return false when master is false", () => {
      transactionManager = new TransactionManager(engineMock, false);
      expect(transactionManager.isMaster).toBe(false);
    });
  });

  describe("transaction getter", () => {
    it("should return the engine transaction", () => {
      transactionManager = new TransactionManager(engineMock);
      expect(transactionManager.transaction).toBe(engineMock.transaction);
    });
  });

  describe("commit method", () => {
    it("should commit the transaction when master is true", async () => {
      transactionManager = new TransactionManager(engineMock, true);
      await transactionManager.commit();
      expect(engineMock.commitTransaction).toHaveBeenCalled();
    });

    it("should not commit the transaction when master is false", async () => {
      transactionManager = new TransactionManager(engineMock, false);
      await transactionManager.commit();
      expect(engineMock.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe("rollback method", () => {
    it("should rollback the transaction when master is true", async () => {
      transactionManager = new TransactionManager(engineMock, true);
      await transactionManager.rollback();
      expect(engineMock.rollbackTransaction).toHaveBeenCalled();
    });

    it("should not rollback the transaction when master is false", async () => {
      transactionManager = new TransactionManager(engineMock, false);
      await transactionManager.rollback();
      expect(engineMock.rollbackTransaction).not.toHaveBeenCalled();
    });
  });
});
