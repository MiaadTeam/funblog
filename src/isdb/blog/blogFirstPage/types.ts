import { IBlogPost } from "../../../schemas/mod.ts";

/**
 * @interface
 * an interface for favorite/most Visited blogPosts that are showed in first page
 * these posts are favorite/most Visited  Posts
 * there are only 15 of them
 */
export interface PopularBlogPosts
  extends Pick<IBlogPost, "_id" | "title" | "photo" | "totalLikes"> {}

/**
 * @interface
 * an interface for blogPosts that are showed in first page
 * these posts are promotion Posts
 * there are only 4 of them
 */
export interface PromotionsBlogPosts
  extends Pick<IBlogPost, "_id" | "title" | "photo" | "summary"> {}

/**
 * @interface
 * an interface for latest blogPosts that are showed in first page
 * there are only 20 of them for the getting rest of them query to database is needed
 */
export interface LatestBlogPosts
  extends Pick<
    IBlogPost,
    "_id" | "title" | "photo" | "summary" | "totalComments"
  > {
  blogCategoryName: string;
  authorName: string;
}

/**
 * @interface
 * an interface for the first page
 */
export interface BlogFirstPage {
  promotionBlogPosts: PromotionsBlogPosts[];
  latestBlogPosts: LatestBlogPosts[];
  popularBlogPosts: PopularBlogPosts[];
}
