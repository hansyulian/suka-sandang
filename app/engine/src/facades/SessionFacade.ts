import {
  InvalidCredentialException,
  UserNotFoundException,
} from "~/exceptions";
import { User } from "~/models";
import { JwtService } from "~/services";
import { verifyPassword } from "~/utils";

export const SessionFacade = {
  emailLogin,
};

export type EmailLoginResult = {
  sessionToken: string;
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
  const sessionToken = await JwtService.signToken(user);
  return {
    sessionToken,
  };
}
