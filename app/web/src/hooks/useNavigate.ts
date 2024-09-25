import { InferParams, InferQuery, RouteNames, routes } from "~/config/routes";
import { useNavigate as useNavigateBase } from "react-router-dom";
import { replacePathParams } from "~/utils/replacePathParams";
import { serializeStringQuery } from "~/utils/serializeStringQuery";
import { useCallback } from "react";

export function useNavigate() {
  const navigate = useNavigateBase();
  return useCallback(
    <Key extends RouteNames>(
      to: Key,
      params: InferParams<Key>,
      query: Partial<InferQuery<Key>> = {}
    ) => {
      const route = routes[to];
      const target = replacePathParams(
        route.path,
        params as Record<string, string | number | boolean>
      );
      return navigate({
        pathname: target,
        search: serializeStringQuery(query as Record<string, string>),
      });
    },
    [navigate]
  );
}
