import { isEmail } from "@hyulian/common";
import {
  Button,
  Fieldset,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";

import { useQueryClient } from "@tanstack/react-query";
import { Api, queryKeys } from "~/config/api";
import { useHandleRedirect } from "~/hooks/useHandleRedirect";
import { useNavigate } from "~/hooks/useNavigate";
import { useSearchQuery } from "~/hooks/useSearchQuery";

export default function LoginPage() {
  const { mutateAsync: login } = Api.session.emailLogin.useRequest({});
  const queryClient = useQueryClient();
  const handleRedirect = useHandleRedirect();
  const { redirect } = useSearchQuery("login");
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (isEmail(value) ? null : "Invalid email"),
      password: (value) => (value ? null : "Required"),
    },
  });

  const handleLogin = async () => {
    const { hasErrors } = form.validate();
    if (hasErrors) {
      return;
    }
    const values = form.getValues();
    await login({
      email: values.email,
      password: values.password,
    });
    await queryClient.invalidateQueries({
      queryKey: queryKeys.getUserInfo(),
    });
    console.log(redirect);
    if (redirect) {
      handleRedirect(redirect);
    } else {
      navigate("login", {});
    }
  };

  return (
    <Fieldset legend="Login">
      <Stack>
        <TextInput
          label="Email"
          placeholder="a@a.com"
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="pass"
          {...form.getInputProps("password")}
        />
        <Button onClick={handleLogin}>Login</Button>
      </Stack>
    </Fieldset>
  );
}
