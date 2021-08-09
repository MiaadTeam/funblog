import {
  assert,
  object,
  string,
  optional,
} from "https://unpkg.com/superstruct/umd/superstruct.min.js";
import {
  blogCategorySelectable,
  RBlogCategory,
} from "../../schemas/blogCategory.ts";

const schema = object({
  details: object({
    set: object({
      _id: string(),
    }),
    get: optional(
      object({
        ...blogCategorySelectable(2),
      })
    ),
  }),
});

export const checkGetBLogCategoryDetails = assert(schema);

/**
 * Represent Input details
 * this is input of deleting BlogTag
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface getBlogCategoryDetails {
  set: {
    _id: string;
  };
  get: RBlogCategory;
}
