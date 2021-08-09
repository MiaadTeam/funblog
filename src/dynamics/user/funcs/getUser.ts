import { throwError } from "./../../../utils/mod.ts";
import { IUser, RUser, users } from "../../../schemas/user.ts";
import { makeProjections } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";

type GetUserInput = { _id: Bson.ObjectID; get: RUser };
type GetUserFn = ({ _id, get }: GetUserInput) => Promise<IUser>;

export const getUser: GetUserFn = async ({ _id, get }) => {
  const projection = makeProjections(get, [], []);
  const foundedUser = await users.findOne({ _id }, { projection });
  const doRelation = async (user: IUser, get: RUser) => {
    //TODO: handle user relations in Ruser
    return user;
  };
  return foundedUser
    ? await doRelation(foundedUser, get)
    : throwError("can not find User");
};
