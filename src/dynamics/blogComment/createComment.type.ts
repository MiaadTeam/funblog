import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import {
  commentSelectable,
  CommentStatus,
  RComment,
} from "../../schemas/comment.ts";

/**
 * this is validator for Create BlogComment
 * this validate the input object,
 * has a tow part {set,get}
 * object "get" for specify user what wants to return
 * object "set" for validate input value involves (name,email,content,blogPostId )
 */
const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        strict: true,
        props: {
          content: { type: "string" },
          blogPostId: { type: "string" },
          blogCommentStatus: {
            type: "enum",
            values: ["ACCEPT", "PENDING", "REJECT"],
          },
          // isReplierBlogComment: { type: "boolean", optional: true },
          parentId: { type: "string", optional: true },
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
export const checkCreateBlogComment = v.compile(schema);
/**
 * Represent Input details
 * this is input of createBlogComment
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface createCommentDetails {
  set: {
    content: string;
    blogPostId: string;
    blogCommentStatus: CommentStatus;
    isReplierBlogComment: boolean;
    parentId?: string;
  };
  get: RComment;
}
