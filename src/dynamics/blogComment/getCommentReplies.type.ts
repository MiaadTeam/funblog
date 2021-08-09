import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { commentSelectable } from "../../schemas/comment.ts";

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
        props: commentSelectable(1),
      },
    },
  },
};
export const checkGetBlogCommentRepliesDetails = v.compile(schema);
