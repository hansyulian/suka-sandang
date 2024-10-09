import { Engine } from "~/Engine";
import { UnexpectedDatabaseTransactionStateException } from "~/exceptions/UnexpectedDatabaseTransactionStateException";
import { transactionChecker } from "~test/utils/checkTransaction";

describe("Engine", () => {
  const engine = new Engine();
  const transactionCheck = transactionChecker(engine);

  beforeEach(async () => {
    transactionCheck.reset();
  });

  describe("transactionManager", () => {
    it("should be able to create a centralized transaction, only the first manager can handle the commit", async () => {
      transactionCheck.expectInitiated(0);

      const firstTransactionManager = await engine.transactionManager();
      transactionCheck.expectInitiated(1);
      expect(firstTransactionManager.transaction).toStrictEqual(
        engine.transaction
      );
      expect(firstTransactionManager.isMaster).toStrictEqual(true);

      const secondTransactionManager = await engine.transactionManager();
      transactionCheck.expectInitiated(2);
      expect(secondTransactionManager.transaction).toStrictEqual(
        engine.transaction
      );
      expect(secondTransactionManager.isMaster).toStrictEqual(false);

      await secondTransactionManager.commit();
      transactionCheck.expectCommited(0);

      await firstTransactionManager.commit();
      transactionCheck.expectCommited(1);
    });
    it("should be able to create a centralized transaction, only the first manager can handle the rollback", async () => {
      transactionCheck.expectInitiated(0);

      const firstTransactionManager = await engine.transactionManager();
      transactionCheck.expectInitiated(1);
      expect(firstTransactionManager.transaction).toStrictEqual(
        engine.transaction
      );
      expect(firstTransactionManager.isMaster).toStrictEqual(true);

      const secondTransactionManager = await engine.transactionManager();
      expect(secondTransactionManager.transaction).toStrictEqual(
        engine.transaction
      );
      expect(secondTransactionManager.isMaster).toStrictEqual(false);

      await secondTransactionManager.rollback();
      transactionCheck.expectRollback(0);

      await firstTransactionManager.rollback();
      transactionCheck.expectRollback(1);
    });
    it("should throw UnexpectedDatabaseTransactionStateException if attempt to commit when the transaction is uninitialized", async () => {
      transactionCheck.expectInitiated(0);
      await expect(engine.commitTransaction()).rejects.toThrow(
        UnexpectedDatabaseTransactionStateException
      );
    });
    it("should throw UnexpectedDatabaseTransactionStateException if attempt to rollback when the transaction is uninitialized", async () => {
      transactionCheck.expectInitiated(0);
      await expect(engine.rollbackTransaction()).rejects.toThrow(
        UnexpectedDatabaseTransactionStateException
      );
    });
  });

  describe("withTransaction", () => {
    it("should be able to handle success with committed transaction", async () => {
      expect(engine.transaction).toBeUndefined();
      const result = await engine.withTransaction(async () => {
        transactionCheck.expectInitiated(1);
        return "The execution is handled correctly";
      });
      expect(result).toStrictEqual("The execution is handled correctly");
      transactionCheck.expectCommited(1);
    });
    it("should be able to handle exception with rollbacked transaction", async () => {
      transactionCheck.expectRollback(0);
      const result = engine.withTransaction(async () => {
        transactionCheck.expectInitiated(1);
        throw new Error("some random error");
      });
      await expect(result).rejects.toEqual(new Error("some random error"));
      transactionCheck.expectRollback(1);
    });
  });
});
