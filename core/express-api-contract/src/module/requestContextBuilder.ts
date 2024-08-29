import { Request, Response } from "express";

export type RequestContext<
  Params extends {},
  Query extends {} | undefined,
  Body extends {} | undefined
> = {
  params: Params;
  query: Query;
  body: Body;
  locals: Atlas.Locals;
  request: Request;
  response: Response;
};

export function requestContextBuilder<
  Params extends {},
  Query extends {} | undefined,
  Body extends {} | undefined
>(request: Request, response: Response): RequestContext<Params, Query, Body> {
  const params = request.params as Params;
  const query = request.query as Query;
  const body = request.body as Body;
  const locals = response.locals || {};
  return {
    body,
    query,
    params,
    request,
    response,
    locals,
  };
}
