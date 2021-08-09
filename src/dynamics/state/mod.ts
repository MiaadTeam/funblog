import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { throwError } from "../../utils/mod.ts";
import { createStateFn } from "./createState.fn.ts";
import { deleteStateFn } from "./deleteState.fn.ts";
import { getStateFn } from "./getState.fn.ts";
import { getStatesFn } from "./getStates.fn.ts";
import { updateStateFn } from "./updateState.fn.ts";

const v = new FastestValidator();
const check = v.compile({
  doit: {
    type: "enum",
    values: [
      "createState",
      "deleteState",
      "updateState",
      "getState",
      "getStates",
    ],
  },
});

export type StateDoit =
  | "createState"
  | "deleteState"
  | "updateState"
  | "getState"
  | "getStates";

type StateFns = (doit: StateDoit, details: any, context: any) => any;

export const stateFns: StateFns = (doit, details, context) => {
  const checkDoit = check({ doit });
  return checkDoit === true
    ? {
        ["updateState"]: async () => await updateStateFn(details, context),
        ["deleteState"]: async () => await deleteStateFn(details, context),
        ["createState"]: async () => await createStateFn(details, context),
        ["getState"]: async () => await getStateFn(details, context),
        ["getStates"]: async () => await getStatesFn(details, context),
      }[doit]()
    : throwError(checkDoit[0].message);
};
