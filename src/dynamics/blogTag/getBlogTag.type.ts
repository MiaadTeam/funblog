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
export const checkGetBlogTagDetails = v.compile(schema);
export interface getBlogTagDetails {
  set: {
    _id: ObjectID;
  };
  get: RBlogTag;
}
