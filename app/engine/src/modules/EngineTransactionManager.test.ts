import { Engine } from "~/Engine";
import { EngineTransactionManager } from "~/modules/EngineTransactionManager";

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

describe("EngineTransactionManager", () => {
  let engineMock: jest.Mocked<Engine>;
  let transactionManager: EngineTransactionManager;

  beforeEach(() => {
    // Create a new mock instance for each test
    engineMock = new Engine() as jest.Mocked<Engine>;
  });

  describe("isMaster getter", () => {
    it("should return true when master is true", () => {
      transactionManager = new EngineTransactionManager(engineMock, true);
      expect(transactionManager.isMaster).toBe(true);
    });

    it("should return false when master is false", () => {
      transactionManager = new EngineTransactionManager(engineMock, false);
      expect(transactionManager.isMaster).toBe(false);
    });
  });

  describe("transaction getter", () => {
    it("should return the engine transaction", () => {
      transactionManager = new EngineTransactionManager(engineMock);
      expect(transactionManager.transaction).toBe(engineMock.transaction);
    });
  });

  describe("commit method", () => {
    it("should commit the transaction when master is true", async () => {
      transactionManager = new EngineTransactionManager(engineMock, true);
      await transactionManager.commit();
      expect(engineMock.commitTransaction).toHaveBeenCalled();
    });

    it("should not commit the transaction when master is false", async () => {
      transactionManager = new EngineTransactionManager(engineMock, false);
      await transactionManager.commit();
      expect(engineMock.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe("rollback method", () => {
    it("should rollback the transaction when master is true", async () => {
      transactionManager = new EngineTransactionManager(engineMock, true);
      await transactionManager.rollback();
      expect(engineMock.rollbackTransaction).toHaveBeenCalled();
    });

    it("should not rollback the transaction when master is false", async () => {
      transactionManager = new EngineTransactionManager(engineMock, false);
      await transactionManager.rollback();
      expect(engineMock.rollbackTransaction).not.toHaveBeenCalled();
    });
  });
});
