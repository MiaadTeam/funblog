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

/**
 * this is validator for Delete BlogCategory
 * this validate the input object,
 * has a tow part {set,get}
 * object "get" for specify user what wants to return
 * object "set" for validate input value involves (_id )
 */

const schema = object({
  details: object({
    set: object({
      _id: string(),
    }),
    get: optional(
      object({
        ...blogCategorySelectable(1),
      })
    ),
  }),
});

export const checkDeleteBlogCategory = assert(schema);

/**
 * Represent Input details
 * this is input of deleting BlogCategory
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface DeleteCategoryDetails {
  set: {
    _id: string;
  };
  get: RBlogCategory;
}
