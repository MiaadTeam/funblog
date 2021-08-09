import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { RUser, userSelectable } from "../../schemas/mod.ts";
/**
 * this is a validator for create user, using fastest validator
 * the result is a boolean
 * this validate the input Object,
 * has two parts {set,get}
 * object "get" for specify user what wants to return
 * object "set" for validate input value
 */

const v = new FastestValidator();

export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        strict: true,
        props: {
          userId: { type: "string" },
          name: { type: "string" },
          lastName: { type: "string" },
          gender: { type: "enum", values: ["MALE", "FEMALE"] },
          birthDate: {
            type: "date",
            default: () => new Date(),
            optional: true,
            convert: true,
          },
          postalCode: { type: "string", optional: true },
          email: { type: "email" },
          creditCardNumber: {
            type: "number",
            optional: true,
            length: 16,
          },
          // TODO: country,state,city : these should be objectIDs?
          addresses: {
            type: "object",
            props: {
              country: { type: "string" },
              state: { type: "string" },
              city: { type: "string" },
              addressTxt: { type: "string" },
            },
            optional: true,
          },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: userSelectable(1),
      },
    },
  },
};

export const checkUpdateUser = v.compile(schema);

export interface updateUserDetails {
  set: {
    userId: string;
    name: string;
    lastName: string;
    gender: string;
    phone: number;
    birthDate: Date;
    postalCode: string;
    email: string;
    creditCardNumber: string;
    addresses: any;
  };
  get: RUser;
}
