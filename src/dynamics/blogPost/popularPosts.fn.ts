import { addToPopular } from "../../isdb/blog/blogFirstPage/actions/mod.ts";
import { PopularBlogPosts } from "../../isdb/blog/blogFirstPage/mod.ts";
import { blogPosts } from "./../../schemas/mod.ts";
export const popularPostsFn = async () => {
  let popularPosts = [];
  const maxNumOfPopularPosts = 10;
  const posts = await (
    await blogPosts
      .find({}, { projection: { title: 1, photo: 1, totalLikes: 1 } })
      .sort({ totalLikes: -1 })
      .toArray()
  ).slice(0, maxNumOfPopularPosts - 1);

  popularPosts = await posts.map(x => {
    addToPopular(x as PopularBlogPosts);
  });

  return popularPosts;
};
