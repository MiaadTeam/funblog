import {
  blogPosts,
  IBlogPost,
  PuBlogPost,
  RBlogPost,
} from "../../../schemas/mod.ts";
import { BasePageSortDetail } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";
import { makePagination } from "../../../utils/mod.ts";
import { makeProjections } from "../../../utils/mod.ts";

type GetBlogPostsInput = {
  filter: Bson.Document;
  getObj: RBlogPost;
} & BasePageSortDetail<PuBlogPost>;
type GetBlogPosts = ({
  filter,
  getObj,
  sort,
  pagination,
}: GetBlogPostsInput) => Promise<IBlogPost[]>;
export const getBlogPosts: GetBlogPosts = async ({
  filter,
  getObj,
  sort,
  pagination,
}) => {
  const projection = makeProjections(getObj, [], []);

  const returnDocuments = await makePagination<PuBlogPost>(
    blogPosts,
    filter,
    projection,
    sort,
    pagination?.limit,
    pagination?.lastObjectId,
    pagination?.page,
  );

  return returnDocuments;
};
