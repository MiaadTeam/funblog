import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { Context } from "../dynamics/utils/mod.ts";
import { Doits, StreamsModels, throwError } from "../utils/mod.ts";
import { FileDoit, fileFns } from "./file/mod.ts";

const v = new FastestValidator();
const check = v.compile({
  model: {
    type: "enum",
    values: ["File"],
  },
});
export const streamsFns = (
  model: StreamsModels,
  doit: Doits,
  details: any,
  context: Context,
) => {
  const checkModel = check({ model });
  return checkModel === true
    ? {
        ["File"]: async () => await fileFns(doit as FileDoit, details, context),
      }[model]()
    : throwError(checkModel[0].message);
};
