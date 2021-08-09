import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { blogTagSelectable, RBlogTag } from "../../schemas/blogTag.ts";
import { ObjectID } from "../../utils/deps.ts";

const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          _id: { type: "objectID", ObjectID },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: blogTagSelectable(1),
      },
    },
  },
};
export const checkDeleteBlogTagDetails = v.compile(schema);
/**
 * Represent Input details
 * this is input of deleting BlogTag
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface DeleteBlogTagDetails {
  set: {
    _id: string;
  };
  get: RBlogTag;
}
