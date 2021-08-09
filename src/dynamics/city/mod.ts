import { getCityFn } from "./getCity.fn.ts";
import { updateCityFn } from "./updateCity.fn.ts";
import { createCityFn } from "./createCity.fn.ts";
import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { ICity } from "../../schemas/mod.ts";
import { deleteCityFn } from "./deleteCity.fn.ts";
import { getCitiesFn } from "./getCities.fn.ts";
import { throwError } from "../../utils/mod.ts";

const v = new FastestValidator();
const check = v.compile({
  doit: {
    type: "enum",
    values: ["createCity", "updateCity", "deleteCity", "getCity", "getCities"],
  },
});

export type CityDoit =
  | "createCity"
  | "updateCity"
  | "deleteCity"
  | "getCity"
  | "getCities";

type CityFns = (doit: CityDoit, details: any, context: any) => any;

export const cityFns: CityFns = (doit, details, context) => {
  const checkDoit = check({ doit });
  return checkDoit === true
    ? {
        ["createCity"]: async () => await createCityFn(details, context),
        ["updateCity"]: async () => await updateCityFn(details, context),
        ["deleteCity"]: async () => await deleteCityFn(details, context),
        ["getCity"]: async () => await getCityFn(details, context),
        ["getCities"]: async () => await getCitiesFn(details, context),
      }[doit]()
    : throwError(checkDoit[0].message);
};
