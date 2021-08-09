import {
  basePaginationValidationObject,
  PaginationType,
  SortType,
} from "./../../utils/mod.ts";
import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import {
  blogTagSelectable,
  PuBlogTag,
  RBlogTag,
} from "../../schemas/blogTag.ts";
import { IBlogPost } from "../../schemas/mod.ts";
const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {
          ...basePaginationValidationObject<PuBlogTag>("name"),

          name: { type: "string", optional: true },
        },
      },
      get: {
        type: "object",
        optional: true,
        props: blogTagSelectable(2),
      },
    },
  },
};
export const checkBlogTagsDetails = v.compile(schema);

export interface getBlogTagsDetails {
  set: {
    name?: string;
    blogPost: IBlogPost;
    sort?: SortType<PuBlogTag>;
    pagination: PaginationType;
  };
  get: RBlogTag;
}
