import { Bson } from "../../../utils/deps.ts";
import {
  blogCategories,
  IBlogCategory,
  RBlogCategory,
} from "./../../../schemas/blogCategory.ts";

type GetBlogCategoriesInput = { filter: Bson.Document; getObj: RBlogCategory };
type GetBlogCategories = ({
  filter,
  getObj,
}: GetBlogCategoriesInput) => Promise<IBlogCategory[]>;
export const getBlogCategories: GetBlogCategories = async ({
  filter,
  getObj,
}) => {
  const foundedBlogCategories = await blogCategories.find(filter);
  let returnBlogCategories = await foundedBlogCategories.toArray();

  return returnBlogCategories;
};
