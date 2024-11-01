type AuthenticatedUser = {
  name: string;
  email: string;
};

type AppRouteContext = {
  authenticatedUser?: AuthenticatedUser;
};

type QueryState = "draft" | "loading" | "loaded" | "error";

type StringQuery = Record<string, string | number | boolean | undefined>;
