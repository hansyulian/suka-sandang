import { createRouter } from "@hyulian/express-api-contract";
import { createMaterialController } from "~/controllers/material/createMaterial";
import { deleteMaterialController } from "~/controllers/material/deleteMaterial";
import { getMaterialController } from "~/controllers/material/getMaterial";
import { listMaterialsController } from "~/controllers/material/listMaterials";
import { updateMaterialController } from "~/controllers/material/updateMaterial";
import { authenticationMiddleware } from "~/middlewares/authenticationMiddleware";

export const materialController = createRouter((atlas) => {
  atlas.middleware(authenticationMiddleware);

  atlas.controller(createMaterialController);
  atlas.controller(deleteMaterialController);
  atlas.controller(getMaterialController);
  atlas.controller(listMaterialsController);
  atlas.controller(updateMaterialController);
});
