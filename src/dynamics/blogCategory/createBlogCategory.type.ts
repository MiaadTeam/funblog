import { FileType } from "./../../streams/utils/uploadFunction.ts";
import {
  object,
  string,
  optional,
  assert,
} from "https://esm.sh/x/superstruct@v0.15.1";
import {
  blogCategorySelectable,
  RBlogCategory,
} from "../../schemas/blogCategory.ts";

/**
 * this is a validator for create blogCategory, using fastest validator
 * the result is a boolean
 * this validate the input Object,
 * has two parts {set,get}
 * object "get" for specify user what wants to return
 * object "set" for validate input value
 */
const getFileValidationObject = (
  allowedType?: string[],
  maxSize: number = 1024
) => ({
  type: "object",
  props: {
    filename: { type: "string" },
    type: allowedType
      ? { type: "enum", values: allowedType }
      : { type: "string" },
    content: {
      type: "any",
    },
    size: { type: "number", max: maxSize * 1024 },
  },
});

const schema = object({
  details: object({
    set: object({
      name: string(),
      enName: string(),
      icon: optional(
        object({
          ...getFileValidationObject(["image/jpeg"], 10 * 1024),
        })
      ),
    }),
    get: optional(
      object({
        ...blogCategorySelectable(1),
      })
    ),
  }),
});

export const checkCreateBlogCategory = assert(schema);

export interface createBlogCategoryDetails {
  set: { name: string; enName: string; icon: FileType; description: string };
  get: RBlogCategory;
}
