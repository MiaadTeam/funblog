import { checkRoleFn } from "../../utils/mod.ts";
import { checkValidation } from "../../utils/mod.ts";
import { Bson } from "../../utils/deps.ts";
import { isAuthFn } from "../../utils/mod.ts";
import { emptyTokenError, notFoundError } from "../../utils/mod.ts";
import { Context } from "../utils/context.ts";
import {
  blogCategories,
  blogPosts,
  blogTags,
  IBlogPost,
} from "./../../schemas/mod.ts";
import { getBlogPost } from "./funcs/getBlogPost.ts";
import {
  checkUpdateBlogPost,
  UpdateBlogPostDetails,
} from "./updateBlogPost.type.ts";
import { getDocumentsFromDocumentRefs } from "./utills/getDocumentsFromDocumentsRef.ts";

type UpdateBlogPost = (
  details: UpdateBlogPostDetails,
  context: Context,
) => Promise<Partial<IBlogPost>>;

/**
 * Represent updateCategory (update category on db)
 * @function
 * @param details
 * @param context
 */
export const updateBlogPost: UpdateBlogPost = async (details, context) => {
  !context ? emptyTokenError() : null;

  /**check user is authenticated */
  const user = await isAuthFn(context.token!);

  /**if user was authenticated,check the user role */
  user ? await checkRoleFn(user, ["Admin", "Editor"]) : notFoundError("User");

  /** check whether the details(input) is right or not*/
  checkValidation(checkUpdateBlogPost, { details });

  const {
    set: { _id, title, summary, content, photo, blogCategoryID, blogTagIDs },
    get,
  } = details;

  //get blogCategory Documents from blogCategoryID
  const newBlogCategory = blogCategoryID
    ? await blogCategories.findOne({
        _id: new Bson.ObjectID(blogCategoryID),
      })
    : null;

  //get blogTag Documents from blogTagIDs array
  const newBlogTags = blogTagIDs
    ? await getDocumentsFromDocumentRefs(blogTagIDs, blogTags)
    : null;

  await blogPosts.updateOne(
    { _id: new Bson.ObjectID(_id) },
    {
      $set: {
        title,
        summary,
        content,
        photo,
        blogCategory: newBlogCategory,
        blogTags: newBlogTags,
      },
    },
  );
  const foundNewBlogPost = await blogPosts.findOne({
    _id: new Bson.ObjectID(_id),
  });
  return Object.keys(get).length != 0
    ? getBlogPost({ _id: foundNewBlogPost!._id, get })
    : { _id: foundNewBlogPost!._id };
};
