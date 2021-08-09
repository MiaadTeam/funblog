import { getFirstPageFn } from "./getBlogFirstPage.fn.ts";
import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { throwError } from "./../../utils/mod.ts";
import { BlogFirstPage } from "../../isdb/blog/blogFirstPage/mod.ts";
const v = new FastestValidator();
const check = v.compile({
  doit: {
    type: "enum",
    values: ["getBlogFirstPage"],
  },
});

export type BlogFirstPageDoit = "getBlogFirstPage";

type BlogFirstPageFns = (doit: BlogFirstPageDoit) => BlogFirstPage;

export const blogFirstPageFns: BlogFirstPageFns = doit => {
  const checkDoit = check({ doit });
  return checkDoit === true
    ? {
        ["getBlogFirstPage"]: () => getFirstPageFn(),
      }[doit]()
    : throwError(checkDoit[0].message);
};

export * from "./getBlogFirstPage.fn.ts";
export * from "./getBlogFirstPage.type.ts";
