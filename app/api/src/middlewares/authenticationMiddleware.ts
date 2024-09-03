import { JwtService, SessionFacade } from "@app/engine";
import { UnauthorizedException } from "@hyulian/express-api-contract";
import { AtlasMiddlewareWrapperFn } from "@hyulian/express-api-contract/dist/types/src/module/types";
import { appConfig } from "~/config";

export const authenticationMiddleware: AtlasMiddlewareWrapperFn =
  async function ({ request, locals }) {
    const tokenFromCookie = request.cookies?.[appConfig.jwtCookieKey];
    const tokenFromHeader = request.headers?.["authorization"];
    const token = tokenFromCookie || tokenFromHeader;
    if (!token) {
      throw new UnauthorizedException();
    }
    const result = await JwtService.verifyToken(token);
    const user = await SessionFacade.getUserInfo(result.id);
    locals.user = user;
  };
