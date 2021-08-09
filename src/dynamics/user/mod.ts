import { getUserFn } from "./getUser.fn.ts";
import { Context } from "./../utils/context.ts";
import { login, LoginReturn } from "./login.fn.ts";
import { IUser } from "../../schemas/user.ts";
import { throwError } from "../../utils/mod.ts";
import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { loginRequest, LoginRequestReturn } from "./loginRequest.fn.ts";
import { getUsersFn } from "./getUsers.fn.ts";
import { updateUserFn } from "./updateUser.fn.ts";
import { insertProfileInfoFn } from "./insertProfileInfo.fn.ts";
import { updateUserRoleFn } from "./updateUserRole.fn.ts";
import { createGhostUser } from "./createGhostUser.fn.ts";

const v = new FastestValidator();
const check = v.compile({
  doit: {
    type: "enum",
    values: [
      "loginRequest",
      "login",
      "insertProfileInfo",
      "getUser",
      "getUsers",
      "updateUser",
      "updateUserRole",
      "createGhostUser",
    ],
  },
});

export type UserDoit =
  | "loginRequest"
  | "login"
  | "insertProfileInfo"
  | "getUser"
  | "getUsers"
  | "updateUser"
  | "updateUserRole"
  | "createGhostUser";

type UsrFns = (
  doit: UserDoit,
  details: any,
  context: Context,
) => Promise<Partial<IUser | IUser[] | LoginRequestReturn | LoginReturn>>;

export const usrFns: UsrFns = (doit, details, context) => {
  const checkDoit = check({ doit });
  return checkDoit === true
    ? {
        ["loginRequest"]: async () => await loginRequest(details),
        ["login"]: async () => await login(details),
        ["insertProfileInfo"]: async () =>
          await insertProfileInfoFn(details, context),
        ["getUser"]: async () => await getUserFn(details, context),
        ["getUsers"]: async () => await getUsersFn(details, context),
        ["updateUser"]: async () => await updateUserFn(details, context),
        ["updateUserRole"]: async () =>
          await updateUserRoleFn(details, context),
        ["createGhostUser"]: async () => await createGhostUser(),
      }[doit]()
    : throwError(checkDoit[0].message);
};
