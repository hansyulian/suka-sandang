import jwt, { TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "~/config";
import {
  ExpiredJwtTokenException,
  InvalidJwtTokenException,
} from "~/exceptions";
import { JwtService } from "~/services/JwtService";

// Mock the jwt module
jest.mock("~/config", () => ({
  appConfig: {
    app: {
      jwtSecret: "it-secret",
      jwtExpiry: "1h",
    },
  },
}));

describe("JwtService", () => {
  const jwtSecret = appConfig.app.jwtSecret;
  const jwtExpiry = appConfig.app.jwtExpiry;
  const userPayload = { id: "user1", email: "user@example.com" };
  const token = "it-token";
  const expiredToken = "expired-token";

  beforeAll(() => {
    // Set up environment variables or appConfig
    (jwt.sign as jest.Mock).mockImplementation(
      (payload, secretKey, options) => token
    );
    (jwt.verify as jest.Mock).mockImplementation((token, secretKey) => {
      if (token === expiredToken) {
        throw new TokenExpiredError("Token expired", new Date());
      }
      return userPayload;
    });
    (jwt.decode as jest.Mock).mockImplementation((token) =>
      token === expiredToken ? null : userPayload
    );
  });

  it("signToken should sign and return a token", async () => {
    const result = await JwtService.signToken(userPayload);
    expect(result).toBe(token);
    expect(jwt.sign).toHaveBeenCalledWith(userPayload, jwtSecret, {
      expiresIn: "1h",
    });
  });

  it("verifyToken should return user payload for valid token", async () => {
    const result = await JwtService.verifyToken(token);
    expect(result).toEqual(userPayload);
    expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
  });

  it("verifyToken should throw ExpiredJwtTokenException for expired token", async () => {
    await expect(JwtService.verifyToken(expiredToken)).rejects.toThrow(
      ExpiredJwtTokenException
    );
  });

  it("verifyToken should throw InvalidJwtTokenException for invalid token", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(JwtService.verifyToken(token)).rejects.toThrow(
      InvalidJwtTokenException
    );
  });

  it("decodeToken should return payload for valid token", async () => {
    const result = await JwtService.decodeToken(token);
    expect(result).toEqual(userPayload);
    expect(jwt.decode).toHaveBeenCalledWith(token);
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
        expiresIn: "1h",
      }
    );
  });
});
