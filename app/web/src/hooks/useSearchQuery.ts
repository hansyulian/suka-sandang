/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSearchParams } from "react-router-dom";
import { InferQuery, RouteKeys } from "~/config/routes";

export function useSearchQuery<RouteKey extends RouteKeys>(key: RouteKey) {
  const [searchParams] = useSearchParams();
  const entries = searchParams.entries();
  const result: any = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result as InferQuery<RouteKey>;
}
