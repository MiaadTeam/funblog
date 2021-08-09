import { BasePageSortDetail } from "./../../../utils/mod.ts";
import {
  blogTags,
  IBlogTag,
  PuBlogTag,
  RBlogTag,
} from "./../../../schemas/blogTag.ts";
import { makeProjections } from "./../../../utils/mod.ts";
import { makePagination } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";

/** filter : any change that is applied on the result is defined in filter */
type GetBlogTagsInput = {
  filter: Bson.Document;
  getObj: RBlogTag;
} & BasePageSortDetail<PuBlogTag>;

type GetBlogTags = ({
  filter,
  getObj,
  sort,
  pagination,
}: GetBlogTagsInput) => Promise<Partial<IBlogTag[]>>;

/**
 * this is return the object that is got by `filter`
 * @param param - include `{filter , get}`
 * @returns
 */
export const getBlogTags: GetBlogTags = async ({
  filter,
  getObj,
  sort,
  pagination,
}) => {
  const projection = makeProjections(getObj, [], ["blogPost"]);
  // const foundedBlogTags = await blogTags.find(filter, { projection });

  const returnDocuments = await makePagination<PuBlogTag>(
    blogTags,
    filter,
    projection,
    sort,
    pagination?.limit,
    pagination?.lastObjectId,
    pagination?.page,
  );

  // let returnBlogTags = await foundedBlogTags.toArray();

  return returnDocuments;
};
