import { changeTotalCommentsForPost } from "./changeTotalBlogCommentsForPost.ts";

import { comments } from "../../../schemas/comment.ts";
import { blogPosts } from "../../../schemas/mod.ts";
import { Bson } from "../../../utils/deps.ts";

export const bidirectionalDeleteBlogComment = async (_id: any) => {
  //bidirectional delete comment
  //steps:
  //1 remove comment ref from blogPost collection into field  blog comments ref
  //2 delete replier comments
  //3 remove comment ref from replied comment
  //4 delete comment from comment collection
  //5 decrement total comment in blog post collection

  const deletedBlogComment = await comments.findOne({
    _id: new Bson.ObjectID(_id),
  });

  if (deletedBlogComment) {
    //step 1
    await blogPosts.updateOne(
      { _id: new Bson.ObjectID(deletedBlogComment!.blogPostId) },
      { $pull: { comments: { _id: deletedBlogComment!._id } } },
    );

    //step 2

    deletedBlogComment.repliedCommentIds
      ? await Promise.all(
          deletedBlogComment.repliedCommentIds.map(
            async (replierBlogComment: any) => {
              await bidirectionalDeleteBlogComment(replierBlogComment);
            },
          ),
        )
      : null;

    //step 3

    deletedBlogComment.parentId
      ? await comments.updateOne(
          { repliedCommentIds: new Bson.ObjectID(deletedBlogComment._id) },
          {
            $pull: {
              repliedCommentIds: new Bson.ObjectID(deletedBlogComment._id),
            },
          },
        )
      : null;

    //step 4

    await comments.deleteOne({ _id: new Bson.ObjectID(_id) });
    //step 5

    await changeTotalCommentsForPost(
      deletedBlogComment!.blogPostId,
      deletedBlogComment.blogCommentStatus,
      undefined,
      true,
    );

    return deletedBlogComment;
  } else {
    throw new Error();
  }
};
