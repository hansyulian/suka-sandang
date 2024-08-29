import { CreateMaterialContract } from "./CreateMaterial";
import { DeleteMaterialContract } from "./DeleteMaterial";
import { GetMaterialContract } from "./GetMaterial";
import { ListMaterialsContract } from "./ListMaterials";
import { UpdateMaterialContract } from "./UpdateMaterial";

export * from "./CreateMaterial";
export * from "./DeleteMaterial";
export * from "./GetMaterial";
export * from "./ListMaterials";
export * from "./UpdateMaterial";

export namespace MaterialContracts {
  export type CreateMaterial = CreateMaterialContract;
  export type DeleteMaterial = DeleteMaterialContract;
  export type GetMaterial = GetMaterialContract;
  export type ListMaterials = ListMaterialsContract;
  export type UpdateMaterial = UpdateMaterialContract;
}
