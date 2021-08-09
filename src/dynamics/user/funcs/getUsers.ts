import { IUser, RUser, users } from "../../../schemas/user.ts";
import { Bson } from "../../../utils/deps.ts";
import { makeProjections } from "../../../utils/mod.ts";

type GetUsersInput = { filter: Bson.Document; getObj: RUser };
type GetUsersFn = ({ filter, getObj }: GetUsersInput) => Promise<IUser[]>;
export const getUsers: GetUsersFn = async ({ filter, getObj }) => {
  const projection = makeProjections(getObj, [], []);

  const foundedUsers = await users.find(filter, { projection });
  let returnUsers = await foundedUsers.toArray();

  return returnUsers;
};
