type AuthenticatedUser = {
  name: string;
  email: string;
};

type AppRouteContext = {
  authenticatedUser?: AuthenticatedUser;
};

type QueryState = "pending" | "loading" | "loaded" | "error";
