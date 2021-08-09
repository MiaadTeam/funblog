import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { IBlogTag } from "../../schemas/blogTag.ts";
import { throwError } from "../../utils/mod.ts";
import { createBlogTag } from "./createBlogTag.fn.ts";
import { deleteBlogTag } from "./deleteBlogTag.fn.ts";
import { getBlogTagFn } from "./getBlogTag.fn.ts";
import { updateBlogTag } from "./updateBlogTag.fn.ts";
import { getBlogTagsFn } from "./getBlogTags.fn.ts";

const v = new FastestValidator();
const check = v.compile({
  doit: {
    type: "enum",
    values: [
      "createBlogTag",
      "updateBlogTag",
      "deleteBlogTag",
      "getBlogTag",
      "getBlogTags",
    ],
  },
});

export type BlogTagDoit =
  | "createBlogTag"
  | "updateBlogTag"
  | "deleteBlogTag"
  | "getBlogTag"
  | "getBlogTags";

type BlogTagFns = (
  doit: BlogTagDoit,
  details: any,
  context: any,
) => Promise<Partial<IBlogTag | IBlogTag[]>>;

export const blogTagFns: BlogTagFns = (doit, details, context) => {
  const checkDoit = check({ doit });
  return checkDoit === true
    ? {
        ["createBlogTag"]: async () => await createBlogTag(details, context),
        ["updateBlogTag"]: async () => await updateBlogTag(details, context),
        ["deleteBlogTag"]: async () => await deleteBlogTag(details, context),
        ["getBlogTag"]: async () => await getBlogTagFn(details, context),
        ["getBlogTags"]: async () => await getBlogTagsFn(details, context),
      }[doit]()
    : throwError(checkDoit[0].message);
};
