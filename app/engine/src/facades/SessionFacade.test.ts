import {
  UserNotFoundException,
  InvalidCredentialException,
} from "~/exceptions";
import { SessionFacade } from "~/facades/SessionFacade";
import { JwtService } from "~/services";
import { userFixtures } from "~test/fixtures/userFixtures";
import { idGenerator } from "~test/utils/idGenerator";
import { initializeDatabase } from "~test/utils/initializeDatabase";
import { resetData } from "~test/utils/resetData";

describe("SessionFacade", () => {
  beforeAll(async () => {
    initializeDatabase();
    await resetData();
    await userFixtures();
  });
  describe("emailLogin", () => {
    it("should be able to login", async () => {
      const email = "test-user-1@email.com";
      const password = "password";
      const result = await SessionFacade.emailLogin(email, password);
      expect(result.sessionToken).toBeDefined();
      const decode = await JwtService.verifyToken(result.sessionToken);
      expect(decode.email).toStrictEqual(email);
      expect(decode.id).toStrictEqual(idGenerator.user(1));
    });
    it("should throw UserNotFoundException when email not exists", async () => {
      const email = "test-user-nonexist@email.com";
      const password = "password";
      expect(SessionFacade.emailLogin(email, password)).rejects.toEqual(
        new UserNotFoundException({ email })
      );
    });
    it("should throw InvalidCredentialException when password is wrong", async () => {
      const email = "test-user-1@email.com";
      const password = "wrongpassword";
      expect(SessionFacade.emailLogin(email, password)).rejects.toEqual(
        new InvalidCredentialException()
      );
    });
  });
});
