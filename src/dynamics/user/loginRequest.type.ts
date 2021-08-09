import type { RUser } from "../../schemas/user.ts";
import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { fieldType } from "../../schemas/utils/fieldType.ts";
import { RType } from "../../schemas/utils/rType.ts";

const v = new FastestValidator();

export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          phone: { type: "number" },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: {
          ok: fieldType,
          phone: fieldType,
        },
      },
    },
  },
};

export const checkLoginReq = v.compile(schema);

export interface SigningDetails {
  set: { phone: number };
  get: {
    ok?: RType;
    phone: RType;
  };
}
