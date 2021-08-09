import { IBlogPost, PuBlogTag, PuComment } from "./../../../schemas/mod.ts";
/**
 * @interface
 * an interface for
 * these posts
 * there
 */
export interface BlogPost
  extends Pick<IBlogPost, "_id" | "title" | "photo" | "summary" | "content"> {
  writer: string;
  blogCategoryName: string;
  comments?: PuComment[];
  blogTags?: PuBlogTag[];
}
