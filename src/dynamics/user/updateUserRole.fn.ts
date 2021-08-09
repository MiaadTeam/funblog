import { throwError } from "./../../utils/mod.ts";
import { getUser } from "./funcs/getUser.ts";
import { IUser, users } from "../../schemas/mod.ts";
import { isAuthFn } from "../../utils/mod.ts";
import { Context } from "../utils/context.ts";
import { checkRoleFn } from "../../utils/mod.ts";
import { checkUpdateUser, updateUserDetails } from "./updateUser.type.ts";
import {
  checkUpdateUserRole,
  updateUserRoleDetails,
} from "./updateUserRole.type.ts";
import { Bson } from "../../utils/deps.ts";

type UpdateUserRole = (
  details: updateUserRoleDetails,
  context: Context,
) => Promise<Partial<IUser>>;

/**
 * @function
 * the user has logged in and has the token,
 * then she/he wants to insert its info(user completing his profile info)
 * @param details
 * @param context
 */

export const updateUserRoleFn: UpdateUserRole = async (details, context) => {
  !context ? throwError("your token is empty") : null;
  const user = await isAuthFn(context.token!);

  !user
    ? throwError("the token is not right! so we didn't find you dear user")
    : null;
  /**check the Role:just the admin can change the user info */

  !checkRoleFn(user, ["Admin"])
    ? throwError("just the admin can change the user Role")
    : null;

  const detailsIsRight = checkUpdateUserRole({ details });
  detailsIsRight !== true && throwError(detailsIsRight[0].message);
  const {
    set: { _id, role },
    get,
  } = details;

  const userObjId = new Bson.ObjectID(_id);
  await users.updateOne(
    { _id: userObjId },
    {
      $addToSet: { level: role },
    },
  );
  return Object.keys(get).length != 0
    ? getUser({ _id: userObjId, get })
    : { _id: userObjId };
  // return get ? await getUser({ _id: userObjId, get }) : user;
};
