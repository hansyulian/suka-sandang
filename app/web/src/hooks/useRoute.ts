/* eslint-disable @typescript-eslint/no-explicit-any */
import { InferParams, InferQuery, RouteKeys, routes } from "~/config/routes";
import { replacePathParams } from "~/utils/replacePathParams";
import { serializeStringQuery } from "~/utils/serializeStringQuery";

export function useRoute<Key extends RouteKeys>(key: Key) {
  const route = routes[key];
  return {
    path: (params: InferParams<Key>, query: Partial<InferQuery<Key>> = {}) => {
      const target = replacePathParams(
        route.path,
        params as Record<string, string | number | boolean>
      );
      const stringQuery = serializeStringQuery(query as any);
      return `${target}${stringQuery}`;
    },
    query: (query: InferQuery<Key>) => {
      return query;
    },
    queryString: (query: InferQuery<Key>) => {
      return serializeStringQuery(query as any);
    },
  };
}
