import jwt, { JwtPayload, TokenExpiredError } from "jsonwebtoken";
import { appConfig } from "~/config";
import {
  ExpiredJwtTokenException,
  InvalidJwtTokenException,
} from "~/exceptions";

interface UserPayload {
  id: string;
  email: string;
}

export const JwtService = {
  signToken,
  verifyToken,
  decodeToken,
};

// Sign a token
async function signToken(
  user: UserPayload,
  expiresIn: string | number = appConfig.app.jwtExpiry
) {
  const { id, email } = user;
  return jwt.sign({ id, email }, appConfig.app.jwtSecret, { expiresIn });
}

// Verify a token
async function verifyToken(token: string) {
  try {
    return jwt.verify(token, appConfig.app.jwtSecret) as UserPayload;
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw new ExpiredJwtTokenException();
    }
    throw new InvalidJwtTokenException();
  }
}

// Decode a token without verifying (useful for extracting payload without validation)
async function decodeToken<T = JwtPayload>(token: string) {
  return jwt.decode(token) as T;
}
