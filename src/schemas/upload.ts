import {
  BlogPostInp,
  blogPostSelectable,
  IBlogPost,
  IUser,
  PuRelBlogPost,
  PuRelUser,
  RBlogPost,
} from "./../schemas/mod.ts";
import {
  Base,
  baseSelectableFields,
  fieldType,
  ObjectID,
  RBase,
  RType,
} from "./utils/mod.ts";
import { checkRelation, decreaseIterate } from "./utils/iretate.ts";
import db from "./../../db.ts";

export interface PuFile extends Base {
  filename: string;
  type: string;
  size: number;
}
export interface RelFile {
  user?: ObjectID | IUser;
  blogPost?: ObjectID | IBlogPost;
}
export interface PuRelFile extends PuFile, RelFile {}

export interface EmFile {
  user?: PuRelUser;
  blogPost?: PuRelBlogPost;
}
export interface IFile extends PuFile, EmFile {}

export interface RFile extends RBase {
  filename?: RType;
  type?: RType;
  size?: RType;
  blogPosts?: RBlogPost;
}

export type FileInp = {
  blogPost: number | BlogPostInp;
};
export const fileSelectable = (depth: number | FileInp = 2): any => {
  const returnObj = {
    ...baseSelectableFields(),
    filename: fieldType,
    type: fieldType,
    size: fieldType,
  };
  const numberDepth = (depth: number, pureObj: Record<string, any>) => {
    depth--;
    depth > -1 &&
      (pureObj = {
        ...pureObj,
        blogPost: {
          type: "object",
          optional: true,
          props: blogPostSelectable(depth),
        },
      });
    return pureObj;
  };

  const objectDepth = (depth: any, pureObj: Record<string, any>) => {
    depth = decreaseIterate<FileInp>(depth);

    checkRelation(depth, "blogPost") &&
      (pureObj = {
        ...pureObj,
        blogPost: {
          type: "object",
          optional: true,
          props: blogPostSelectable(depth.blogPost),
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

/**@interface
 *main interface and the collection in mongoDB is based on this collection
 */
export const files = db.collection<IFile>("Files");
