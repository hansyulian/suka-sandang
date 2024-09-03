import { emailLoginContract } from "@app/common";
import { SessionFacade } from "@app/engine";
import { contractController } from "@hyulian/express-api-contract";
import { appConfig } from "~/config";

export const emailLoginController = contractController(
  emailLoginContract,
  async ({ body, response }) => {
    const { email, password } = body;
    const loginResult = await SessionFacade.emailLogin(email, password);
    response.cookie(appConfig.jwtCookieKey, {
      httpOnly: true,
      secure: appConfig.env === "production",
      maxAge: appConfig.jwtExpiry,
      sameSite: "strict",
    });
    return {
      sessionToken: loginResult.token,
    };
  }
);
