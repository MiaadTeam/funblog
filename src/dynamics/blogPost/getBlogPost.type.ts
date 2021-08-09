import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { blogPostSelectable, RBlogPost } from "../../schemas/mod.ts";

const v = new FastestValidator();

export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        strict: true,
        props: {
          _id: { type: "string" },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: blogPostSelectable({
          author: 1,
          blogCategory: {
            blogPost: 0,
          },
          comments: {
            user: 2,
            blogPost: 0,
          },
          likedUsers: 1,
          blogTags: 1,
        }),
      },
    },
  },
};

export const checkGetBlogPostDetails = v.compile(schema);

export interface getBlogPostDetails {
  set: {
    _id: string;
  };
  get: RBlogPost;
}
