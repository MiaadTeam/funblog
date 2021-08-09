import { ObjectID } from "./utils/bases/base.ts";
import { Base, baseSelectableFields, fieldType } from "./utils/mod.ts";
import {
  ICity,
  citySelectable,
  RCity,
  CityInp,
  RState,
  IState,
  stateSelectable,
  StateInp,
  PuRelState,
  PuRelCity,
} from "./mod.ts";

import { checkRelation, decreaseIterate } from "./utils/iretate.ts";
import db from "../../db.ts";
/*
 when we are just an interface we can have all relations even those are we don't care about it
  or we never populate them in real world but sometime we get queried them on related schema
   so with this way we can resolved many issued on gathering body get field
 
   for example in this interface we never insert states and cities on country schema 
   but in the interface we have it just for whenever get field in body is requested them
*/

/**
 * @interface
 * PURE country: This is an interface for primitives types of country  */
export interface PuCountry extends Base {
  name: string;
  enName: string;
  /**
   * save set of polygon of point of this city
   */
  geometries: {
    type: "Polygon";
    coordinates: [number, number][];
  };
}
export interface RelCountry {
  states?: ObjectID[] | IState[];
  cities?: ObjectID[] | ICity[];
}

export interface PuRelCountry extends PuCountry, RelCountry {}
/**
 * @interface
 * Embedded country: This is an interface for embedded fields in country collection*/

export interface EmCountry {
  states?: PuRelState[];
  cities?: PuRelCity[];
}

/**
 * @interface
 * inRelation country: This is an interface for the relations of country that are kept in collection*/

export interface InCountry {
  state: IState;
}

/**
 * @interface
 * OutRelation country: This is an interface for those relations of country that are not kept inside country collection*/
export interface OutCountry {
  cities: ICity[];
}

/**@interface
 * this is the main interface and the collection in mongoDB is based on this collection
 */
export interface ICountry extends EmCountry, PuCountry, Base {}

export interface RCountry {
  _id?: 0 | 1;
  name?: 0 | 1;
  enName?: 0 | 1;
  states?: RState;
  cities?: RCity;
}
export type CountryInp = {
  states: number | StateInp;
  cities: number | CityInp;
};
export const countrySelectable: any = (depth: number | CountryInp = 2): any => {
  const returnObj = {
    ...baseSelectableFields(),
    _id: fieldType,
    name: fieldType,
    enName: fieldType,
  };
  const numberDepth = (depth: number, pureObj: Record<string, any>) => {
    depth--;
    depth > -1 &&
      (pureObj = {
        ...pureObj,
        states: {
          type: "object",
          optional: true,
          props: stateSelectable(depth),
        },

        cities: {
          type: "object",
          optional: true,
          props: citySelectable(depth),
        },
      });
    return pureObj;
  };

  const objectDepth = (depth: any, pureObj: Record<string, any>) => {
    depth = decreaseIterate<CountryInp>(depth);

    checkRelation(depth, "states") &&
      (pureObj = {
        ...pureObj,
        states: {
          type: "object",
          optional: true,
          props: stateSelectable(depth.state),
        },
      });

    checkRelation(depth, "cities") &&
      (pureObj = {
        ...pureObj,
        cities: {
          type: "object",
          optional: true,
          props: citySelectable(depth.cities),
        },
      });
    return pureObj;
  };

  const completeObj =
    typeof depth === "number"
      ? numberDepth(depth, returnObj)
      : objectDepth(depth, returnObj);

  return completeObj;
};

export const countries = db.collection<ICountry>("Countries");
