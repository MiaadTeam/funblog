import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { RState, stateSelectable } from "../../schemas/mod.ts";
const v = new FastestValidator();

/**
 * this is validator for create IState
 * this validate the input object,
 * has a tow part {set,get}
 * object "get" for specify user what wants to return
 * object "set" for validate input value
 */

export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          /**
           * The name of the state in native language (Ex: تهران)
           * min length is 2 , max length is 255
           */
          name: { type: "string", min: 2, max: 255 },
          /**
           * The name of the state in English (Ex: Tehran)
           * min length is 2 , max length is 255
           */
          enName: { type: "string", min: 2, max: 255 },

          /**
           * Id of Country
           */
          countryId: { type: "string" },

          /**
           * polynomial of point IStates
           */
          geometries: {
            type: "array",
            item: "[number,number]",
            optional: true,
          },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: stateSelectable(2),
      },
    },
  },
};

export const checkCreateState = v.compile(schema);
/**
 * @interface
 * Represent Input details
 * this is input of state
 * object "get" for specify user what wants to return
 * object "set" for input value
 */
export interface ICreateStateDetails {
  set: {
    name: string;
    enName: string;
    countryId: string;
    geometries: [number, number][];
  };
  get: RState;
}
