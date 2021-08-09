import { getPureDoc } from "./../../utils/mod.ts";
import { countries } from "./../../schemas/country.ts";
import { throwError } from "./../../utils/mod.ts";
import { getUser } from "./funcs/getUser.ts";
import { cities, IUser, states, users } from "../../schemas/mod.ts";
import { isAuthFn } from "../../utils/mod.ts";
import { Context } from "../utils/context.ts";
import { checkRoleFn } from "../../utils/mod.ts";
import { checkUpdateUser, updateUserDetails } from "./updateUser.type.ts";
import { Bson } from "../../utils/deps.ts";

type UpdateUser = (
  details: updateUserDetails,
  context: Context,
) => Promise<Partial<IUser>>;

/**
 * @function
 * the user has logged in and has the token,
 * then she/he wants to insert its info(user completing his profile info)
 * @param details
 * @param context
 */

export const updateUserFn: UpdateUser = async (details, context) => {
  !context ? throwError("your token is empty") : null;
  const user = await isAuthFn(context.token!);

  !user
    ? throwError("the token is not right! so we didn't find you dear user")
    : null;
  /**check the Role:just the admin can change the user info */
  !(await checkRoleFn(user, ["Admin"]))
    ? throwError("just the admin can change the user info")
    : null;

  const detailsIsRight = checkUpdateUser({ details });
  detailsIsRight !== true && throwError(detailsIsRight[0].message);
  const {
    // TODO: how to handle address
    set: {
      userId,
      name,
      lastName,
      gender,
      birthDate,
      postalCode,
      email,
      creditCardNumber,
      addresses,
    },
    get,
  } = details;

  const country = await getPureDoc({
    _idArray: [addresses.country],
    schema: countries,
    puProps: ["name", "enName"],
  });
  const state = await getPureDoc({
    _idArray: [addresses.state],
    schema: states,
    puProps: ["name", "enName"],
  });
  const city = await getPureDoc({
    _idArray: [addresses.city],
    schema: cities,
    puProps: ["name", "enName"],
  });
  const userObjId = new Bson.ObjectID(userId);
  await users.updateOne(
    { _id: userObjId },
    {
      $set: {
        name,
        lastName,
        gender,
        birthDate,
        postalCode,
        email,
        creditCardNumber,
        addresses: {
          country,
          state,
          city,
        },
      },
    },
  );
  console.group("addresses", "===============");
  console.log(addresses.country);
  console.groupEnd();
  return get ? await getUser({ _id: userObjId, get }) : user;
};
