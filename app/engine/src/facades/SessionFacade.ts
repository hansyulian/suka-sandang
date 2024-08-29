import {
  InvalidCredentialException,
  UserNotFoundException,
} from "~/exceptions";
import { User } from "~/models";
import { JwtService } from "~/services";
import { verifyPassword } from "~/utils";

export const SessionFacade = {
  emailLogin,
  getUserProfile,
};

export type EmailLoginResult = {
  token: string;
};

async function emailLogin(
  email: string,
  password: string
): Promise<EmailLoginResult> {
  const user = await User.findOne({
    where: {
      email,
    },
  });
  if (!user) {
    throw new UserNotFoundException();
  }
  if (!(await verifyPassword(password, user.password))) {
    throw new InvalidCredentialException();
  }
  const token = await JwtService.signToken(user);
  return {
    token,
  };
}

async function getUserProfile(id: string) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new UserNotFoundException({ id });
  }
  return user;
}
