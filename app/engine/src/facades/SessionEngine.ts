import {
  InvalidCredentialException,
  UserNotFoundException,
} from "~/exceptions";
import { EngineBase } from "~/facades/EngineBase";
import { User } from "~/models";
import { JwtService } from "~/services";
import { verifyPassword } from "~/utils";

export type EmailLoginResult = {
  sessionToken: string;
};

export class SessionEngine extends EngineBase {
  async emailLogin(email: string, password: string): Promise<EmailLoginResult> {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new UserNotFoundException({ email });
    }
    if (!(await verifyPassword(password, user.password))) {
      throw new InvalidCredentialException();
    }
    const sessionToken = await JwtService.signToken(user);
    return {
      sessionToken,
    };
  }
}
