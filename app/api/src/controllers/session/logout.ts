import { logoutContract, simpleSuccessResponse } from "@app/common";
import { contractController } from "@hyulian/express-api-contract";
import { appConfig } from "~/config";

export const logoutController = contractController(
  logoutContract,
  async ({ body, response }) => {
    response.cookie(appConfig.jwtCookieKey, "", {
      httpOnly: true,
      secure: appConfig.env === "production",
      maxAge: 0,
      sameSite: "strict",
    });
    return {
      ...simpleSuccessResponse,
    };
  }
);
