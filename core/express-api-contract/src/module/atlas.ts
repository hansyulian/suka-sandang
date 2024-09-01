import { pad } from "@hyulian/common";

import { atlasRouter } from "./atlasRouter";
import { contractValidator } from "./contractValidator";
import { createAtlasInstanceContext } from "./createAtlasInstanceContext";
import { getContractExpressPath } from "./getContractExpressPath";
import { middlewareWrapper } from "./middlewareWrapper";
import { routeContract } from "./routeContract";
import {
  AtlasInstanceContext,
  AtlasRouterInitFn,
  AtlasRouterInitOptions,
} from "./types";
import { NextFunction, Request, Response } from "express";

export function atlas(
  initFn: AtlasRouterInitFn,
  options: AtlasRouterInitOptions = {}
) {
  const context = createAtlasInstanceContext();
  const instance = atlasRouter("/", context, { params: {} });
  initFn(instance);

  validateInstance(context, options);

  applyValidators(context);
  applyMiddlewares(context);
  applyContracts(context);
  if (options.onError) {
    context.express.use(
      (err: any, req: Request, res: Response, next: NextFunction) => {
        options.onError!(err, req, res, next);
      }
    );
  }

  return {
    express: context.express,
    start: (port: number) => {
      context.express.listen(port, () => {
        console.log("Server started at port ", port);
      });
    },
  };
}

function validateInstance(
  context: AtlasInstanceContext,
  options: AtlasRouterInitOptions
) {
  if (options.disableRouterAndContractPathValidation) {
    return;
  }
  let valid = true;
  for (const record of context.contracts) {
    const { contract, routerBasePath } = record;
    const path = getContractExpressPath(contract);
    if (!path.startsWith(routerBasePath || "")) {
      valid = false;
      console.log("inconsistent contract router", routerBasePath, path);
    }
  }
  if (!valid) {
    throw new Error("InconsistentRouting");
  }
}

function applyMiddlewares(context: AtlasInstanceContext) {
  const middlewares = [...context.middlewares].sort((a, b) =>
    a.path.length > b.path.length ? 1 : -1
  );
  for (const record of middlewares) {
    const { method, middleware, path } = record;
    const normalizedPath = `/${path}`;
    switch (method) {
      case "all":
        context.express.use(normalizedPath, middlewareWrapper(middleware));
        break;
      case "get":
        context.express.get(normalizedPath, middlewareWrapper(middleware));
        break;
      case "post":
        context.express.post(normalizedPath, middlewareWrapper(middleware));
        break;
      case "put":
        context.express.put(normalizedPath, middlewareWrapper(middleware));
        break;
      case "delete":
        context.express.delete(normalizedPath, middlewareWrapper(middleware));
        break;
    }
  }
}

function applyContracts(context: AtlasInstanceContext) {
  const longestPath = context.contracts.reduce(
    (prev, current) =>
      prev < current.contractPath.length ? current.contractPath.length : prev,
    0
  );
  const contracts = [...context.contracts].sort((a, b) => {
    return a.contractPath > b.contractPath ? 1 : -1;
  });
  for (const record of contracts) {
    const { contract, controller, contractPath } = record;
    console.log(
      contract.method.toUpperCase(),
      pad(contractPath, longestPath, {
        align: "left",
      }),
      controller.name
    );
    switch (contract.method) {
      case "get":
        context.express.get(contractPath, routeContract(contract, controller));
        break;
      case "post":
        context.express.post(contractPath, routeContract(contract, controller));
        break;
      case "put":
        context.express.put(contractPath, routeContract(contract, controller));
        break;
      case "delete":
        context.express.delete(
          contractPath,
          routeContract(contract, controller)
        );
        break;
    }
  }
}

function applyValidators(context: AtlasInstanceContext) {
  for (const record of context.contracts) {
    const { contract } = record;
    const path = getContractExpressPath(contract);
    switch (contract.method) {
      case "get":
        context.express.get(path, contractValidator(contract));
        break;
      case "post":
        context.express.post(path, contractValidator(contract));
        break;
      case "put":
        context.express.put(path, contractValidator(contract));
        break;
      case "delete":
        context.express.delete(path, contractValidator(contract));
        break;
    }
  }
}
