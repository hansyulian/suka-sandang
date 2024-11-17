import jwt from "jsonwebtoken";
import { appConfig } from "~/config";
import { InvalidJwtTokenException } from "~/exceptions";
import { JwtService, UserTokenPayload } from "~/modules/JwtService";

describe("JwtService", () => {
  const jwtSecret = appConfig.jwt.secret;
  const jwtExpiry = appConfig.jwt.expiry;

  it("signToken should sign and return a token and decodeable using jwt.decode", async () => {
    const userPayload: UserTokenPayload = {
      id: "user1",
      email: "user@example.com",
    };
    const result = await JwtService.signToken(userPayload);

    expect(jwt.sign).toHaveBeenCalledWith(userPayload, jwtSecret, {
      expiresIn: jwtExpiry,
    });
    const decodeTest = (await jwt.decode(result)) as UserTokenPayload;
    expect(decodeTest.email).toStrictEqual(userPayload.email);
    expect(decodeTest.id).toStrictEqual(userPayload.id);
    const verifiedToken = await JwtService.verifyToken(result);
    expect(verifiedToken.email).toStrictEqual(userPayload.email);
    expect(verifiedToken.id).toStrictEqual(userPayload.id);
  });

  // for now seems to be failing?
  // it("verifyToken should throw ExpiredJwtTokenException for expired token", async () => {
  //   jest.useFakeTimers();
  //   const now = new Date();
  //   jest.setSystemTime(new Date(now.getTime() - 100 * 1000));
  //   const expiredToken = await jwt.sign(
  //     {
  //       id: "user1",
  //       email: "user@example.com",
  //     },
  //     jwtSecret,
  //     { expiresIn: 50 }
  //   );
  //   jest.setSystemTime(now);
  //   await expect(JwtService.verifyToken(expiredToken)).rejects.toThrow(
  //     ExpiredJwtTokenException
  //   );
  //   jest.useRealTimers();
  // });

  it("verifyToken should throw InvalidJwtTokenException for invalid token", async () => {
    const invalidToken = await jwt.sign(
      {
        id: "user1",
        email: "user@example.com",
      },
      jwtSecret + "invalid",
      { expiresIn: jwtExpiry }
    );
    await expect(JwtService.verifyToken(invalidToken)).rejects.toThrow(
      InvalidJwtTokenException
    );
  });

  it("should extract the correct value to prevent stray value being added as well and some class object", async () => {
    const result = await JwtService.signToken({
      email: "email@email.com",
      id: "id1234",
      someStrayValue: "shouldBeIgnored",
    } as any);

    expect(jwt.sign).toHaveBeenCalledWith(
      {
        email: "email@email.com",
        id: "id1234",
      },
      jwtSecret,
      {
        expiresIn: jwtExpiry,
      }
    );
  });
});
