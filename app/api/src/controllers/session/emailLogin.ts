import { emailLoginContract } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { appConfig } from "~/config";

export const emailLoginController = contractController(
  emailLoginContract,
  async ({ body, response, locals }) => {
    const { engine } = locals;
    const { email, password } = body;
    const loginResult = await engine.session.emailLogin(email, password);
    response.cookie(appConfig.jwt.cookieKey, loginResult.sessionToken, {
      httpOnly: true,
      secure: appConfig.env === "production",
      maxAge: appConfig.jwt.expiry * 1000,
      sameSite: "strict",
    });
    return {
      sessionToken: loginResult.sessionToken,
    };
  }
);
