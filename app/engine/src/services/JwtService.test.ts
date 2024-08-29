import jwt, { TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "~/config";
import {
  ExpiredJwtTokenException,
  InvalidJwtTokenException,
} from "~/exceptions";
import { JwtService } from "~/services/JwtService";

// Mock the jwt module
jest.mock("jsonwebtoken");
jest.mock("~/config", () => ({
  appConfig: {
    app: {
      jwtSecret: "test-secret",
      jwtExpiry: "1h",
    },
  },
}));

describe("JwtService", () => {
  const jwtSecret = appConfig.app.jwtSecret;
  const jwtExpiry = appConfig.app.jwtExpiry;
  const userPayload = { id: "user1", email: "user@example.com" };
  const token = "test-token";
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

  test("signToken should sign and return a token", async () => {
    const result = await JwtService.signToken(userPayload);
    expect(result).toBe(token);
    expect(jwt.sign).toHaveBeenCalledWith(userPayload, jwtSecret, {
      expiresIn: "1h",
    });
  });

  test("verifyToken should return user payload for valid token", async () => {
    const result = await JwtService.verifyToken(token);
    expect(result).toEqual(userPayload);
    expect(jwt.verify).toHaveBeenCalledWith(token, jwtSecret);
  });

  test("verifyToken should throw ExpiredJwtTokenException for expired token", async () => {
    await expect(JwtService.verifyToken(expiredToken)).rejects.toThrow(
      ExpiredJwtTokenException
    );
  });

  test("verifyToken should throw InvalidJwtTokenException for invalid token", async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error("Invalid token");
    });

    await expect(JwtService.verifyToken(token)).rejects.toThrow(
      InvalidJwtTokenException
    );
  });

  test("decodeToken should return payload for valid token", async () => {
    const result = await JwtService.decodeToken(token);
    expect(result).toEqual(userPayload);
    expect(jwt.decode).toHaveBeenCalledWith(token);
  });
});
