import {
  InvalidCredentialException,
  UserNotFoundException,
} from "~/exceptions";
import { User } from "~/models";
import { JwtService } from "~/services/JwtService";
import { verifyPassword } from "~/utils/verifyPassword";

export const SessionFacade = {
  emailLogin,
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
  if (await verifyPassword(password, user.password)) {
    throw new InvalidCredentialException();
  }
  const token = await JwtService.signToken(user);
  return {
    token,
  };
}
