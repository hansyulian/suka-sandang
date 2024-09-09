import React, { useEffect, useState } from "react";
import { Api } from "~/config/api";

export interface AuthContext {
  authenticatedUser: AuthenticatedUser | null | undefined;
  isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: user, ...rest } = Api.session.getUserInfo.useRequest({}, {});
  const [authenticatedUser, setAuthenticatedUser] = useState<
    AuthenticatedUser | null | undefined
  >();

  useEffect(() => {
    if (rest.isLoading) {
      setAuthenticatedUser(undefined);
      return;
    }
    if (rest.error) {
      setAuthenticatedUser(null);
      return;
    }
    if (user) {
      return setAuthenticatedUser({
        email: user.email,
        name: user.name,
      });
      return;
    }
  }, [rest.error, rest.isLoading, user]);

  return (
    <AuthContext.Provider
      value={{ authenticatedUser, isLoading: authenticatedUser === undefined }}
    >
      {children}
    </AuthContext.Provider>
  );
}
