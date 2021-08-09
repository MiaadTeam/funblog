import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { Doits, StaticModels, throwError } from "../utils/mod.ts";
import { BlogFirstPageDoit, blogFirstPageFns } from "./blogFirstPage/mod.ts";

const v = new FastestValidator();
const check = v.compile({
  model: {
    type: "enum",
    values: ["BlogFirstPage"],
  },
});

export const staticFns = (model: StaticModels, doit: Doits) => {
  const checkModel = check({ model });
  return checkModel === true
    ? {
        ["BlogFirstPage"]: () => blogFirstPageFns(doit as BlogFirstPageDoit),
      }[model]()
    : throwError(checkModel[0].message);
};

export * from "./blogFirstPage/mod.ts";
