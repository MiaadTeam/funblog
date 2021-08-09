import { IBlogPost } from "./../../schemas/mod.ts";
import { Bson } from "../../utils/deps.ts";
import { checkValidation } from "./../../utils/mod.ts";
import { getBlogPosts } from "./funcs/getBlogPosts.ts";
import {
  checkBlogPostsDetails,
  getBlogPostsDetails,
} from "./getBlogPosts.type.ts";

type GetBlogPostsFn = (
  details: getBlogPostsDetails,
) => Promise<Partial<IBlogPost[]>>;

/**
 * @function
 * get blogPosts with especial filters
 * @param details
 * @param context
 */
export const getBlogPostsFn: GetBlogPostsFn = async details => {
  checkValidation(checkBlogPostsDetails, { details });
  const {
    set: { title, content, blogCategory, blogTags, sort, pagination },
    get,
  } = details;

  let filter: Bson.Document = {};

  title && (filter.title = { $regex: title });
  content && (filter.content = { $regex: content });

  blogTags &&
    (filter = {
      ...filter,
      "blogTags.name": { $in: blogTags },
    });
  blogCategory &&
    (filter = {
      ...filter,
      "blogCategory.name": { $regex: blogCategory },
    });

  return getBlogPosts({
    filter,
    getObj: get,
    sort: sort,
    pagination: {
      limit: pagination?.limit,
      page: pagination?.page,
      lastObjectId: pagination?.lastObjectId,
    },
  });
};
