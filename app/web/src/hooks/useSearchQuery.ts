/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { InferQuery, RouteNames } from "~/config/routes";

export function useSearchQuery<RouteName extends RouteNames>(
  _routeName: RouteName
) {
  const [searchParams] = useSearchParams();
  const query = useMemo(() => {
    const entries = searchParams.entries();
    const result: any = {};
    for (const [key, value] of entries) {
      result[key] = value;
    }
    return result as InferQuery<RouteName>;
  }, [searchParams]);

  return query;
}
