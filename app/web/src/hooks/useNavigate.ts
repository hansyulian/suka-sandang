import { InferParams, InferQuery, RouteKeys, routes } from "~/config/routes";
import { useNavigate as useNavigateBase } from "react-router-dom";
import { replacePathParams } from "~/utils/replacePathParams";

export function useNavigate() {
  const navigate = useNavigateBase();
  return <Key extends RouteKeys>(
    to: Key,
    params: InferParams<Key>,
    query: Partial<InferQuery<Key>> = {}
  ) => {
    const route = routes[to];
    const target = replacePathParams(
      route.path,
      params as Record<string, string | number | boolean>
    );
    navigate({
      pathname: target,
      search: query as never,
    });
  };
}
