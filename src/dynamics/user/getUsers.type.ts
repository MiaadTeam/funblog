import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { userSelectable } from "../../schemas/mod.ts";

const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          name: { type: "string", optional: true },
          lastName: { type: "string", optional: true },
          level: {
            type: "enum",
            values: ["Admin", "Normal", "Editor", "Author", "Ghost"],
            optional: true,
          },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: userSelectable(2),
      },
    },
  },
};
export const checkUsersDetails = v.compile(schema);
