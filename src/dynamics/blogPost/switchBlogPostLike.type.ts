import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { blogPostSelectable, RBlogPost } from "../../schemas/mod.ts";

const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          _id: { type: "string" },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: blogPostSelectable(2),
      },
    },
  },
};
export const checkSwitchBlogPostLike = v.compile(schema);

/**
 * Represent Input details
 * this is input of like/dislike blogPost
 * object "get" for specify user what wants to return
 * object "set" for input value involve(_id of Post)
 * @interface
 */
export interface SwitchBlogPostLikeDetails {
  set: {
    _id: string;
  };
  get: RBlogPost;
}
