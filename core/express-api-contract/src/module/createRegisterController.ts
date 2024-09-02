import { ApiContractSchema } from "@hyulian/api-contract";
import { stringRender, unslash } from "@hyulian/common";

import { createExpressParamsMap } from "./createExpressParamsMap";
import { createRegisterContractMiddleware } from "./createRegisterContractMiddleware";
import {
  AtlasContractController,
  AtlasInstanceContext,
  AtlasRegisterContractFn,
} from "./types";

export type AtlasCreateRegisterControllerFn = (
  routerBasePath: string,
  context: AtlasInstanceContext
) => AtlasRegisterContractFn;

export const createRegisterController: AtlasCreateRegisterControllerFn = (
  routerBasePath,
  context
) => {
  return function <TApiContractSchema extends ApiContractSchema>(
    contractController: AtlasContractController<TApiContractSchema>
  ) {
    const { contract, controller } = contractController;
    const paramsMap = createExpressParamsMap(contract.params);
    const contractPath = `/${unslash(stringRender(contract.path, paramsMap))}`;
    context.contracts.push({
      routerBasePath,
      contract,
      controller: controller as any,
      contractPath,
    });
    return {
      middleware: createRegisterContractMiddleware<TApiContractSchema>(
        contract,
        context
      ),
    };

    // const expressParams = createParamsMap(contract.params);
    // const path = contract.path(expressParams);
    // const expressController = routeContract(contract, controller);
    // switch (contract.method) {
    //   case 'get':
    //     context.express.get(path, expressController);
    //     break;
    //   case 'post':
    //     context.express.post(path, expressController);
    //     break;
    //   case 'put':
    //     context.express.put(path, expressController);
    //     break;
    //   case 'delete':
    //     context.express.delete(path, expressController);
    //     break;
    // }
  };
};
