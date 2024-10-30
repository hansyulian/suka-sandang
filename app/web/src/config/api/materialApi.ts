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

export const materialApi = {
  getMaterial: apiClient.registerQueryContract(
    getMaterialContract,
    queryKeys.material
  ),
  listMaterial: apiClient.registerQueryContract(
    listMaterialsContract,
    queryKeys.material
  ),
  createMaterial: apiClient.registerMutationContract(
    createMaterialContract,
    apiMutationOptions({
      title: "Material",
      message: "Adding new material",
      successMessage: "New material added!",
    })
  ),
  updateMaterial: apiClient.registerMutationContract(
    updateMaterialContract,
    apiMutationOptions({
      title: "Material",
      message: "Updating material",
      successMessage: "Material updated!",
    })
  ),
  deleteMaterial: apiClient.registerMutationContract(
    deleteMaterialContract,
    apiMutationOptions({
      title: "Material",
      message: "Deleting material",
      successMessage: "Material deleted!",
    })
  ),
  getMaterialOptions: apiClient.registerQueryContract(
    getMaterialOptionsContract,
    queryKeys.materialOptions
  ),
};
