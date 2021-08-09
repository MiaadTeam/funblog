import { checkValidation } from "../../utils/mod.ts";
import { Bson } from "../../utils/deps.ts";
import { IComment } from "./../../schemas/comment.ts";
import { getComments } from "./funcs/getComments.ts";
import {
  checkGetCommentsDetails,
  getBlogCommentsDetails,
} from "./getComments.type.ts";

type GetCommentsFn = (
  details: getBlogCommentsDetails,
) => Promise<Partial<IComment[]>>;

/**
 * @function
 * getting comments
 * @param details
 * @param context
 */
export const getCommentsFn: GetCommentsFn = async details => {
  /** check whether the details(input) is right or not*/
  checkValidation(checkGetCommentsDetails, { details });

  const {
    set: { email, blogPostId, commentStatus, sort, pagination },
    get,
  } = details;

  let filter: Bson.Document = {};

  if (email)
    filter = {
      ...filter,
      "user.email": { $regex: email },
    };
  if (blogPostId) filter.blogPostId = { $regex: blogPostId };
  if (commentStatus) {
    filter.blogCommentStatus = { $regex: commentStatus };
  }

  return getComments({
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
