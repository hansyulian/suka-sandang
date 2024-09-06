import { InferParams, RouteKeys } from "~/config/routes";
import { useParams as useParamsBase } from "react-router-dom";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useParams<Key extends RouteKeys>(_key: Key) {
  const params = useParamsBase();
  return params as InferParams<Key>;
}
