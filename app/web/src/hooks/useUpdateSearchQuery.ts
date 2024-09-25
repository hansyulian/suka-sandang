import { cleanUndefined } from "@hyulian/common";
import { useCallback } from "react";
import { InferParams, InferQuery, RouteNames } from "~/config/routes";
import { useNavigate } from "~/hooks/useNavigate";

export function useUpdateSearchQuery<RouteName extends RouteNames>(
  routeName: RouteName,
  params: InferParams<RouteName>,
  baseQuery: Partial<InferQuery<RouteName>> = {}
) {
  const navigate = useNavigate();

  const update = useCallback(
    (query: Partial<InferQuery<RouteName>> = {}) => {
      navigate(
        routeName,
        params,
        cleanUndefined({
          ...baseQuery,
          ...query,
        })
      );
    },
    [baseQuery, navigate, params, routeName]
  );

  return update;
}
