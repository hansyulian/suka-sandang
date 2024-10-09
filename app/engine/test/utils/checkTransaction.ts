import { Engine } from "~/Engine";

export function transactionChecker(engine: Engine) {
  const originalCommit = engine.commitTransaction;
  const originalRollback = engine.rollbackTransaction;
  const originalTransactionManager = engine.transactionManager;
  const commitSpy = jest
    .spyOn(engine, "commitTransaction")
    .mockImplementation(originalCommit);
  const rollbackSpy = jest
    .spyOn(engine, "rollbackTransaction")
    .mockImplementation(originalRollback);
  const transactionManagerSpy = jest
    .spyOn(engine, "transactionManager")
    .mockImplementation(originalTransactionManager);

  return {
    expectInitiated: (calledTimes = 1) => {
      expect(transactionManagerSpy).toHaveBeenCalledTimes(calledTimes);
    },
    expectCommited: (calledTimes = 1) => {
      expect(commitSpy).toHaveBeenCalledTimes(calledTimes);
      expect(rollbackSpy).toHaveBeenCalledTimes(0);
    },
    expectRollback: (calledTimes = 1) => {
      expect(commitSpy).toHaveBeenCalledTimes(0);
      expect(rollbackSpy).toHaveBeenCalledTimes(calledTimes);
    },
    reset: async () => {
      if (engine.transaction) {
        await engine.transaction.rollback();
        engine.transaction = undefined;
      }
      jest.clearAllMocks();
    },
  };
}
