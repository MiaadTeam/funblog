import { checkRelation, Iterate } from "./utils/iretate.ts";
import { RUser } from "./user.ts";
import {
  BlogPostInp,
  blogPostSelectable,
  IBlogPost,
  RBlogPost,
} from "./mod.ts";
import { PuBlogPost, PuUser, userSelectable, UserSelectInp } from "./mod.ts";
import { Base, baseSelectableFields, RBase } from "./utils/bases/base.ts";
import { fieldType } from "./utils/fieldType.ts";
import { RType } from "./utils/rType.ts";
import { decreaseIterate } from "./utils/iretate.ts";
import { Bson } from "../utils/deps.ts";
import db from "../../db.ts";

export enum CommentStatus {
  ACCEPT,
  PENDING,
  REJECT,
}

/**
 *  @interface
 * PURE blogComment: This is an interface for primitives types of blogComment
 */
export interface PuComment {
  content: string;
  blogCommentStatus: CommentStatus;
}

/**
 * @interface
 * Embedded BlogComment: This is an interface for embedded fields in blogComment collection
 * the fields that are outRelation and we keep certain number of them are also here*/
export interface EmComment {
  user: PuUser;
  blogPost?: PuBlogPost;
  repliedComments?: PuComment[];
}

/**
 * @interface
 * inRelation BlogComment: This is an interface for the relations of blogComment that are kept in collection*/
export interface InComment {
  /**this field is a relation of blogComment with itself, we have to keep an array of blog comments objectIds, the number may exceed from 1000 objectId, but because we have to keep the references this should be inner relation*/
  repliedCommentIds: IComment;
  blogPostId: IBlogPost;
}

/**
 * @interface
 * OutRelation BlogComment: This is an interface for those relations of comments that are not kept inside blogComment collection*/
export interface OutComment {}

/**
 * @interface
 * Interface BlogPost: This is the main interface for blogPost that is extended form PureBlogComment and EmbeddedBlogComment.
 * it is consist of :primitive fields + Embedded Fields
 * */
export interface IComment extends PuComment, EmComment, Base {
  repliedCommentIds?: Bson.ObjectID[];
  parentId?: Bson.ObjectID;
  blogPostId: Bson.ObjectID;
}

export interface RComment extends RBase {
  content?: RType;
  parentId?: RType;
  blogCommentStatus?: RType;
  repliedCommentIds?: RType;
  blogPost?: RBlogPost;
  user?: RUser;
}

export type CommentInp = {
  user: number | UserSelectInp;
  blogPost: number | BlogPostInp;
  repliedComments?: number | CommentInp;
};

export const commentSelectable = (depth: number | CommentInp = 2): any => {
  const returnObj = {
    ...baseSelectableFields(),
    content: fieldType,
    blogCommentStatus: fieldType,
  };
  const numberDepth = (depth: number, pureObj: Record<string, any>) => {
    depth--;
    depth > -1 &&
      (pureObj = {
        ...pureObj,
        user: {
          type: "object",
          optional: true,
          props: userSelectable(depth),
        },
        blogPost: {
          type: "object",
          optional: true,
          props: blogPostSelectable(depth),
        },
        repliedComments: {
          type: "object",
          optional: true,
          props: commentSelectable(depth),
        },
      });
    return pureObj;
  };

  const objectDepth = (depth: any, pureObj: Record<string, any>) => {
    depth = decreaseIterate<CommentInp>(depth);

    checkRelation(depth, "user") &&
      (pureObj = {
        ...pureObj,
        user: {
          type: "object",
          optional: true,
          props: userSelectable(depth.user),
        },
      });

    checkRelation(depth, "blogPost") &&
      (pureObj = {
        ...pureObj,
        blogPost: {
          type: "object",
          optional: true,
          props: blogPostSelectable(depth.blogPost),
        },
      });

    checkRelation(depth, "repliedComments") &&
      (pureObj = {
        ...pureObj,
        repliedComments: {
          type: "object",
          optional: true,
          props: commentSelectable(depth.repliedComments),
        },
      });
    return pureObj;
  };

  const completeObj =
    typeof depth === "number"
      ? numberDepth(depth, returnObj)
      : objectDepth(depth, returnObj);

  return completeObj;
};

export const comments = db.collection<IComment>("Comments");
