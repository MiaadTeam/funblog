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
 * this is validator for update blogCategory
 * this validate the input object,
 * has a tow part {set,get}
 * object "get" for specify user what wants to return
 * object "set" for validate input value involves (_id,name,enName, icon, description )
 */

const schema = object({
  details: object({
    set: object({
      _id: optional(string()),
      name: optional(string()),
      enName: optional(string()),
      icon: optional(string()),
      description: optional(string()),
    }),
    get: optional(
      object({
        ...blogCategorySelectable(1),
      })
    ),
  }),
});

export const checkUpdateBlogCategory = assert(schema);

/**
 * Represent Input details
 * this is input of updating BlogTag
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface UpdateBlogCategoryDetails {
  set: {
    //this is the _id of the blogCategory that we want to update
    _id: string;
    //these fields are the fields that can be modified on blogCategory
    name?: string;
    enName?: string;
    icon?: string;
    description?: string;
  };
  get: RBlogCategory;
}
