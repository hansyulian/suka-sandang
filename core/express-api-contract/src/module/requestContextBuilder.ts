import { Request, Response } from "express";

export function requestContextBuilder<
  Params extends {},
  Query extends {} | undefined,
  Body extends {} | undefined
>(
  request: Request,
  response: Response
): Atlas.RequestContext<Params, Query, Body> {
  const params = request.params as Params;
  const query = request.query as Query;
  const body = request.body as Body;
  const locals = response.locals || {};
  const context: any = {
    body,
    query,
    params,
    request,
    response,
    locals,
  };
  return context;
}
