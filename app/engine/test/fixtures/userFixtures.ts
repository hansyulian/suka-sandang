import { User } from "~/models";
import { hashPassword } from "~/utils";
import { idGenerator } from "~test/utils/idGenerator";

export async function userFixtures() {
  return await User.create({
    id: idGenerator.user(1),
    name: "Test User 1",
    email: "test-user-1@email.com",
    password: await hashPassword("password"),
  });
}
