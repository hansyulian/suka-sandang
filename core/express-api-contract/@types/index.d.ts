declare namespace Atlas {
  export interface Locals {}
  export interface RequestContextExtension {}

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
  } & RequestContextExtension;
}

declare namespace Express {
  export interface Request {
    _atlasContext: Atlas.RequestContext<any, any, any>;
  }
}
