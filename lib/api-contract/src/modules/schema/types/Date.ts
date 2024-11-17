import { BaseSpec, OptionalSpec } from "./Base";

export type DateSpecOptions = {
  min?: Date;
  max?: Date;
};
export type DateSpec = BaseSpec<"date", DateSpecOptions>;
export type DatesSpec = BaseSpec<"dates", DateSpecOptions>;
export type OptionalDateSpec = DateSpec & OptionalSpec<Date>;
export type OptionalDatesSpec = DatesSpec & OptionalSpec<Date[]>;
