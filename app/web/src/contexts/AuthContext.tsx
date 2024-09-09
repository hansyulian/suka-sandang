import React, { useEffect, useMemo, useState } from "react";
import { Api } from "~/config/api";
import { calculateQueryState } from "~/utils/calculateQueryState";

export interface AuthContext {
  state: "pending" | "loading" | "loaded" | "error";
  authenticatedUser?: AuthenticatedUser;
  isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, ...rest } = Api.session.getUserInfo.useRequest({}, {});
  const [authenticatedUser, setAuthenticatedUser] =
    useState<AuthenticatedUser>();

  useEffect(() => {
    if (!rest.isError && !rest.isFetched) {
      return;
    }
    if (rest.error) {
      return setAuthenticatedUser(undefined);
    }
    if (user) {
      return setAuthenticatedUser({
        email: user.email,
        name: user.name,
      });
    }
  }, [rest.error, rest.isError, rest.isFetched, user]);

  const state = calculateQueryState(rest);

  return (
    <AuthContext.Provider
      value={{ state, authenticatedUser, isLoading: state === "loading" }}
    >
      {children}
    </AuthContext.Provider>
  );
}
