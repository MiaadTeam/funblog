import { decode } from "https://deno.land/x/djwt@v1.9/mod.ts";
import { users } from "../schemas/user.ts";
import { Bson } from "./deps.ts";
import { throwError } from "./mod.ts";
/**
 *the token is checked (the userId is extracted) and check 
whether the user exist or not
 * @param token the token in the context
 * @returns foundUser
 */
export const isAuthFn = async (token: string) => {
  const userId = await getTokenDetails(token);
  const foundUser = await users.findOne({ _id: new Bson.ObjectId(userId) });
  return foundUser ? foundUser : throwError("can not find any user");
};

export const getTokenDetails = async (jwt: string) => {
  const { payload } = await decode(jwt);
  return payload.usersId as string;
};
