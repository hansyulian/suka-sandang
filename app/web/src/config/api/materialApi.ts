import {
  getMaterialContract,
  listMaterialsContract,
  createMaterialContract,
  updateMaterialContract,
  deleteMaterialContract,
  getMaterialOptionsContract,
} from "@app/common";
import { apiClient } from "~/config/api/baseApi";
import { queryKeys } from "~/config/queryKeys";
import { apiMutationOptions } from "~/utils/apiMutationOptions";
import { queryKeyFn } from "~/utils/queryKeyFn";

export const getMaterialApi = apiClient.registerQueryContract(
  getMaterialContract,
  queryKeyFn.single(queryKeys.material)
);
export const listMaterialApi = apiClient.registerQueryContract(
  listMaterialsContract,
  queryKeyFn.many(queryKeys.material)
);
export const createMaterialApi = apiClient.registerMutationContract(
  createMaterialContract,
  apiMutationOptions({
    title: "Material",
    message: "Adding new material",
    successMessage: "New material added!",
  })
);
export const updateMaterialApi = apiClient.registerMutationContract(
  updateMaterialContract,
  apiMutationOptions({
    title: "Material",
    message: "Updating material",
    successMessage: "Material updated!",
  })
);
export const deleteMaterialApi = apiClient.registerMutationContract(
  deleteMaterialContract,
  apiMutationOptions({
    title: "Material",
    message: "Deleting material",
    successMessage: "Material deleted!",
  })
);
export const getMaterialOptionsApi = apiClient.registerQueryContract(
  getMaterialOptionsContract,
  queryKeyFn.option(queryKeys.material)
);
