import { ApiContractSchema } from "@hyulian/api-contract";
import { AtlasApiContractDetail } from "~/module";

export function contractCompareFunction(
  a: AtlasApiContractDetail<ApiContractSchema>,
  b: AtlasApiContractDetail<ApiContractSchema>
) {
  const splittedAPath = a.contractPath
    .split("/")
    .filter((part) => part.length > 0);
  const splittedBPath = b.contractPath
    .split("/")
    .filter((part) => part.length > 0);
  let index = 0;
  while (true) {
    const aPart = splittedAPath[index];
    if (!aPart) {
      return -1;
    }
    const bPart = splittedBPath[index];
    if (!bPart) {
      return 1;
    }
    if (aPart.startsWith(":")) {
      return 1;
    }
    if (bPart.startsWith(":")) {
      return -1;
    }
    if (aPart > bPart) {
      return 1;
    }
    if (aPart < bPart) {
      return -1;
    }
    index += 1;
  }
}
