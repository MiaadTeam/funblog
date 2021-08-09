import {
  comments,
  IComment,
  RComment,
  PuComment,
} from "../../../schemas/comment.ts";
import { BasePageSortDetail } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";
import { makePagination } from "../../../utils/mod.ts";

type GetCommentsInput = {
  filter: Bson.Document;
  getObj: RComment;
  deps?: number;
} & BasePageSortDetail<PuComment>;

type GetComments = ({
  filter,
  getObj,
  deps,
  sort,
  pagination,
}: GetCommentsInput) => Promise<IComment[]>;

export const getComments: GetComments = async ({
  filter,
  getObj,
  deps,
  sort,
  pagination,
}) => {
  deps ? deps-- : (deps = 3);
  let returnDocuments = await makePagination<PuComment>(
    comments,
    filter,
    getObj,
    sort,
    pagination?.limit,
    pagination?.lastObjectId,
    pagination?.page,
  );

  return returnDocuments;
};
