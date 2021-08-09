import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { ICity, RCity, citySelectable, PuCity } from "../../schemas/mod.ts";

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
          ...basePaginationValidationObject<PuCity>("name"),

          name: { type: "string", optional: true },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: citySelectable(2),
      },
    },
  },
};
export const checkStatesDetails = v.compile(schema);

export interface getStatesDetails {
  set: {
    name?: string;
    blogPost: ICity;
    sort?: SortType<PuCity>;
    pagination: PaginationType;
  };
  get: RCity;
}
