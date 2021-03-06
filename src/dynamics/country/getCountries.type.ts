import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import {
  ICountry,
  RCountry,
  citySelectable,
  PuCountry,
  countrySelectable,
} from "../../schemas/mod.ts";

import {
  basePaginationValidationObject,
  PaginationType,
  SortType,
} from "./../../utils/mod.ts";

const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          ...basePaginationValidationObject<PuCountry>("name"),

          name: { type: "string", optional: true },
          enName: { type: "string", optional: true },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: countrySelectable(2),
      },
    },
  },
};
export const checkCountriesDetails = v.compile(schema);

export interface getCountriesDetails {
  set: {
    name?: string;
    enName?: string;
    sort?: SortType<PuCountry>;
    pagination: PaginationType;
  };
  get: RCountry;
}
