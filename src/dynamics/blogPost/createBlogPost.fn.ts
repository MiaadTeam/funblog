import { addToLatest } from "./../../isdb/blog/blogFirstPage/actions/addToLatest.ts";
import { checkRoleFn } from "../../utils/mod.ts";
import { checkValidation } from "../../utils/mod.ts";
import { getPureDoc } from "../../utils/mod.ts";
import { isAuthFn } from "../../utils/mod.ts";
import { manEmbedded } from "../../utils/mod.ts";
import {
  blogCategories,
  blogPosts as bp,
  blogTags,
  IBlogPost,
} from "./../../schemas/mod.ts";
import { emptyTokenError, notFoundError } from "./../../utils/mod.ts";
import { Context } from "./../utils/context.ts";
import {
  checkCreateBlogPost,
  createBlogPostDetails,
} from "./createBlogPost.type.ts";
import { getBlogPost } from "./funcs/getBlogPost.ts";
import { LatestBlogPosts } from "../../isdb/blog/blogFirstPage/types.ts";
import { Bson } from "../../utils/deps.ts";

type CreateBlogPost = (
  details: createBlogPostDetails,
  context: Context
) => Promise<Partial<IBlogPost>>;

/**
 * @function
 * Represent create BlogPost(insert userToAuthor new blogPost to DB)
 * @param details
 * @param context
 * @returns the newly created blogPost
 */
export const createBlogPost: CreateBlogPost = async (details, context) => {
  !context ? emptyTokenError() : null;
  /**check user is authenticated */
  const user = await isAuthFn(context.token!);
  /**if user was authenticated,check the user role */
  user ? await checkRoleFn(user, ["Admin", "Editor"]) : notFoundError("User");
  /** check whether the details(input) is right or not*/
  checkValidation(checkCreateBlogPost, { details });

  const {
    set: { title, summary, content, photo, blogCategoryID, blogTagIDs },
    get,
  } = details;

  /**get pure blogCategory */
  const postBlogCategory = await getPureDoc({
    _idArray: [blogCategoryID],
    schema: blogCategories,
    puProps: ["name", "enName", "icon", "description"],
  });

  /**get the pure blogTags */
  const pureTags = await getPureDoc({
    _idArray: blogTagIDs!,
    schema: blogTags,
    puProps: ["name"],
  });

  /**
   * add pureUser to blogPost as author
   */
  const author = await getPureDoc({
    IDocument: user!,
    puProps: ["name", "lastName", "email", "gender"],
  });

  /**the new post insert to DB */
  const createdBlogPost = await bp.insertOne({
    title,
    summary,
    content,
    photo,
    blogCategory: postBlogCategory,
    blogTags: pureTags,
    author,
    totalComments: 0,
  });

  const ob = new Bson.ObjectID(createdBlogPost);
  const createdBlogPostDoc = await bp.findOne({ _id: ob });

  const purePost = await getPureDoc({
    IDocument: createdBlogPostDoc!,
    puProps: ["title", "summary", "photo"],
  });

  /**handle the tags that are embedding this newly created post */
  await manEmbedded({
    array: blogTagIDs!,
    schema: blogTags,
    embeddedField: "blogPosts",
    document: [purePost!],
    limit: 50,
    headOrTail: "tail",
    sortBy: "title",
    sortOrder: "Descending",
  });

  /**add the newly created Post to blogFirstPage in ISDB */
  const latestPost: LatestBlogPosts = {
    _id: createdBlogPostDoc!._id,
    title: createdBlogPostDoc!.title,
    summary: createdBlogPostDoc!.summary,
    blogCategoryName: createdBlogPostDoc!.blogCategory!.name,
    authorName: createdBlogPostDoc!.author.name!,
    totalComments: createdBlogPostDoc!.totalComments!,
    photo: createdBlogPostDoc!.photo!,
    // createdAt: createdBlogPostDoc,
  };
  await addToLatest(latestPost);
  // const isdbPost: BlogPost = {
  //   _id: createdBlogPostDoc!._id,
  //   title: createdBlogPostDoc!.title,
  //   summary: createdBlogPostDoc!.summary,
  //   content: createdBlogPostDoc!.content,
  //   blogCategoryName: createdBlogPostDoc!.blogCategory!.name,
  //   writer: createdBlogPostDoc!.author.name!,
  //   photo: createdBlogPostDoc!.photo!,
  //   // createdAt: createdBlogPostDoc,
  // };
  // await addPostToIsdb(isdbPost!); doit by syd
  /**add the  createdBlogPost to storeFirstPage in ISDB */

  return Object.keys(get).length != 0
    ? getBlogPost({ _id: ob, get })
    : { _id: createdBlogPostDoc!._id };
};
