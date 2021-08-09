import {
  assert,
  object,
  string,
  optional,
} from "https://unpkg.com/superstruct/umd/superstruct.min.js";

import {
  IBlogPost,
  blogCategorySelectable,
  RBlogCategory,
} from "../../schemas/mod.ts";

const schema = object({
  details: object({
    set: object({
      name: optional(string()),
      enName: optional(string()),
      description: optional(string()),
    }),
    get: optional(
      object({
        ...blogCategorySelectable(2),
      })
    ),
  }),
});

export const checkGetBlogCategoriesDetail = assert(schema);

/**
 * Represent Input details
 * this is input of deleting BlogTag
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface getBlogCategoriesDetails {
  set: {
    name?: string;
    enName?: string;
    description?: string;
    blogPosts: IBlogPost;
  };
  get: RBlogCategory;
}
