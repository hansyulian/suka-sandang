import { emailLoginContract } from "@app/common";
import { SessionFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";

export const emailLoginController = contractController(
  emailLoginContract,
  async function emailLogin({ body }) {
    const { email, password } = body;
    const loginResult = await SessionFacade.emailLogin(email, password);
    return {
      sessionToken: loginResult.token,
    };
  }
);
