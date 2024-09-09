import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "~/hooks/useAuth";
import { useRoute } from "~/hooks/useRoute";

export function RequireAuth() {
  const { authenticatedUser } = useAuth();
  const loginRoute = useRoute("login");
  const location = useLocation();
  console.log(authenticatedUser);
  if (!authenticatedUser) {
    return (
      <Navigate
        to={loginRoute.path(
          {},
          {
            redirect: location.pathname,
          }
        )}
        replace
      />
    );
  }
  return <Outlet />;
}
