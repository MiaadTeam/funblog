import { blogPosts } from "../../../../schemas/mod.ts";
import { firstPageSlice } from "../mod.ts";
import {
  BlogFirstPage,
  LatestBlogPosts,
  PopularBlogPosts,
  PromotionsBlogPosts,
} from "../types.ts";

export const initializeBlogFirstPage = async () => {
  const { validate, setState } = firstPageSlice;
  const numOfPopularPosts = 10;
  const numOfLatestPosts = 20;
  const numOfPromotionPosts = 6;

  const promotes = await blogPosts
    .find(
      {},
      {
        projection: {
          _id: 1,
          title: 1,
          photo: 1,
          summary: 1,
        },
      },
    )
    .limit(numOfPromotionPosts)
    .toArray();

  const latest = await blogPosts
    .find(
      {},
      {
        projection: {
          _id: 1,
          title: 1,
          summary: 1,
          blogCategory: 1,
          author: 1,
          totalComments: 1,
          photo: 1,
        },
      },
    )
    .sort({ _id: 1 })
    .limit(numOfLatestPosts)
    .toArray();
  const latestBlogPosts: LatestBlogPosts[] = latest.map((x: any) => {
    const b = {
      _id: x._id,
      title: x.title,
      summary: x.summary,
      blogCategoryName: x.blogCategory!.name,
      authorName: x.author.name,
      totalComments: x.totalComments,
      photo: x.photo!,
    };
    return b;
  });

  const popular = await blogPosts
    .find({}, { projection: { _id: 1, title: 1, photo: 1, totalLikes: 1 } })
    .sort({ totalLikes: 1 })
    .limit(numOfPopularPosts)
    .toArray();

  const db: BlogFirstPage = {
    promotionBlogPosts: promotes! as PromotionsBlogPosts[],
    latestBlogPosts: latestBlogPosts as LatestBlogPosts[],
    popularBlogPosts: popular! as PopularBlogPosts[],
  };

  validate(db);
  setState(db);
  firstPageSlice.setup();
  return db;
};
