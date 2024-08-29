import {
  InvalidCredentialException,
  UserNotFoundException,
} from "~/exceptions";
import { User, UserUpdateAttributes } from "~/models";
import { JwtService } from "~/services";
import { verifyPassword } from "~/utils";

export const SessionFacade = {
  emailLogin,
  getUserInfo: getUserInfo,
  updateUserInfo,
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

async function getUserInfo(id: string) {
  const user = await User.findByPk(id);
  if (!user) {
    throw new UserNotFoundException({ id });
  }
  return user;
}

async function updateUserInfo(id: string, data: UserUpdateAttributes) {
  const { name } = data;
  const user = await getUserInfo(id);
  const updatePayload = {
    name,
  };
  const result = await user.update(updatePayload);
  return result;
}
