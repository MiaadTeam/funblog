import { Context } from "./../utils/context.ts";
import { getUsers } from "./funcs/getUsers.ts";
import { throwError } from "./../../utils/mod.ts";
import { IUser, Level, RUser } from "./../../schemas/user.ts";
import { checkUsersDetails } from "./getUsers.type.ts";
import { Bson } from "../../utils/deps.ts";

interface getUsersDetails {
  set: {
    name?: string;
    lastName?: string;
    level?: string;
  };
  get: RUser;
}

type GetUsersFn = (
  details: getUsersDetails,
  context: Context,
) => Promise<Partial<IUser[]>>;

/**
 * @function
 * this function searches the users and return those with (name,level,lastName)
 * @param details
 * @param context
 */
export const getUsersFn: GetUsersFn = async (details, context) => {
  //  context ? await isAuthFn(context.token) : throwError("your token is empty");
  // await isAdminFn(user);

  const detailsIsRight = checkUsersDetails({ details });
  detailsIsRight !== true && throwError(detailsIsRight[0].message);
  const {
    set: { name, lastName, level },
    get,
  } = details;

  let filter: Bson.Document = {};

  if (name) filter.name = { $regex: name };
  if (lastName) filter.lastName = { $regex: lastName };
  if (lastName) filter.level = { $regex: level };
  return getUsers({ filter, getObj: get });
};
