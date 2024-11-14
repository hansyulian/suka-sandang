/* eslint-disable @typescript-eslint/no-explicit-any */
type AuthenticatedUser = {
  name: string;
  email: string;
};

type AppRouteContext = {
  authenticatedUser?: AuthenticatedUser;
};

type QueryState = "draft" | "loading" | "loaded" | "error";

type StringQuery = Record<string, string | number | boolean | undefined>;

type SelectionOption<Values = string, Data = any> = {
  label: string;
  value: Values;
  disabled?: boolean;
  data?: Data;
};
