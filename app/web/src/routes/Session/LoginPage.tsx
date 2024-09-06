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
import { useNavigate, useSearch } from "@tanstack/react-router";
import { Api, queryKeys } from "~/config/api";

export function LoginPage() {
  const navigate = useNavigate();

  const { redirect } = useSearch({
    from: "/session/login",
  });
  const { mutateAsync: login } = Api.session.emailLogin.useRequest({});
  const queryClient = useQueryClient();

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
    navigate({
      to: redirect || "/",
    });
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
