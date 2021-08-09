import { manEmbedded } from "./../../utils/mod.ts";
import { getPureDoc } from "./../../utils/mod.ts";
import { checkRoleFn } from "../../utils/mod.ts";
import { checkValidation } from "../../utils/mod.ts";
import { isAuthFn } from "../../utils/mod.ts";
import { emptyTokenError, notFoundError } from "../../utils/mod.ts";
import { comments, CommentStatus, IComment } from "./../../schemas/comment.ts";
import { Context } from "./../utils/context.ts";
import {
  checkCreateBlogComment,
  createCommentDetails,
} from "./createComment.type.ts";
import { getComment } from "./funcs/getComment.ts";
import { blogPosts } from "../../schemas/mod.ts";
import { Bson } from "../../utils/deps.ts";

const createComment = async (
  user: Bson.Document,
  content: string,
  blogPostId: string,
  parentId: string | undefined,
) => {
  /**
   * step1: creating the new comment in db, with all the fields even if empty
   */

  const createdBlogCommentID = await comments.insertOne({
    user,
    content,
    blogPostId,
    parentId,
    blogCommentStatus: CommentStatus.PENDING,
  });

  /**
   * step2: if the comment is replied to another comment, add the child commentId to the repliedCommentIds of the parent
   */

  parentId
    ? await comments.updateOne(
        { _id: new Bson.ObjectID(parentId) },
        {
          $addToSet: { repliedCommentIds: createdBlogCommentID },
        },
      )
    : null;
  const ob = new Bson.ObjectID(createdBlogCommentID);
  return { _id: ob };
};

type CreateComment = (
  details: createCommentDetails,
  context: Context,
) => Promise<Partial<IComment>>;

/**
 * @function
 * Represent createWareClass (insert wareClass to db)
 * @param details
 * @param context
 */
export const createCommentFn: CreateComment = async (details, context) => {
  !context ? emptyTokenError() : null;

  /**check user is authenticated */
  const user = await isAuthFn(context.token!);

  /**if user was authenticated,check the user role */
  user
    ? await checkRoleFn(user, ["Admin", "Editor", "Normal", "Author"])
    : notFoundError("User");

  /** check whether the details(input) is right or not*/
  checkValidation(checkCreateBlogComment, { details });
  const {
    set: { content, blogPostId, parentId },
    get,
  } = details;

  /**get the pureUser(only fields that we want for comments)from user */
  const pureUser = await getPureDoc({
    IDocument: user!,
    puProps: ["name", "lastName", "email"],
  });
  /**check if the rep;ied blog comment exists */
  if (parentId) {
    const check = await comments.findOne({
      _id: new Bson.ObjectID(parentId),
    });
    check == undefined ? notFoundError("the replied blog Comment") : null;
  }

  const createdComment = await createComment(
    pureUser!,
    content,
    blogPostId,
    parentId,
  );

  const pureComment = await getPureDoc({
    _idArray: [createdComment._id.toHexString()],
    schema: comments,
    puProps: ["content"],
  });

  await manEmbedded({
    array: [blogPostId!],
    schema: blogPosts,
    embeddedField: "comments",
    document: [pureComment!],
    limit: 50,
    headOrTail: "tail",
    sortBy: "email",
    sortOrder: "Ascending",
  });
  const commentWithUser = {
    ...pureComment,
    user: pureUser,
  };
  //keep 50 direct child of the comment in the parent comment
  if (parentId) {
    await manEmbedded({
      array: [parentId!],
      schema: comments,
      embeddedField: "repliedComments",
      document: [commentWithUser!],
      limit: 50,
      headOrTail: "tail",
      sortBy: "email",
      sortOrder: "Ascending",
    });
  }
  return Object.keys(get).length != 0
    ? getComment({ _id: createdComment!._id, get })
    : { _id: createdComment!._id };
};
