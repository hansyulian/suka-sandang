import React, { useMemo } from "react";
import { Api } from "~/config/api";
import { calculateQueryState } from "~/utils/calculateQueryState";

export interface AuthContext {
  state: "pending" | "loading" | "loaded" | "error";
  authenticatedUser?: AuthenticatedUser;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, ...rest } = Api.session.getUserInfo.useRequest({}, {});
  const authenticatedUser = useMemo<AuthenticatedUser | undefined>(() => {
    if (!user) {
      return;
    }
    return {
      email: user.email,
      name: user.name,
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ state: calculateQueryState(rest), authenticatedUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
