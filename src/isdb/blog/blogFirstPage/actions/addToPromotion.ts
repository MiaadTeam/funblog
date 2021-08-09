import { firstPageSlice } from "../mod.ts";
import { BlogFirstPage, PromotionsBlogPosts } from "../types.ts";

export const addToPromotion = async (blogPost: PromotionsBlogPosts) => {
  const { getState, validate, setState } = firstPageSlice;
  const db = getState();
  //   TODO: check unique

  const newDb: BlogFirstPage = {
    ...db,
    promotionBlogPosts: [...db.promotionBlogPosts, blogPost],
  };

  validate(newDb);
  setState(newDb);
  return newDb.promotionBlogPosts;
};
