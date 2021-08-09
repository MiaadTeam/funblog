import { IUser, users } from "../../schemas/user.ts";
import { create, Payload } from "https://deno.land/x/djwt@v1.9/mod.ts";
import { throwError } from "../../utils/mod.ts";
import { checkLogin, LoginDetails } from "./login.type.ts";
import { refinePhone } from "../../utils/mod.ts";
import { Bson } from "../../utils/deps.ts";
import {
  delLoginToken,
  getLoginToken,
} from "../../utils/services/inMemoryDb/login.ts";

export const key = "your-secret";

export const payload: Payload = {
  // six month credit time
  exp: Date.now() / 1000 + 60 * 60 * 24 * 30 * 6,
};
export interface LoginReturn {
  user?: IUser;
  token?: string;
}
type Login = (details: LoginDetails) => Promise<LoginReturn>;

/**
 *this function get phone and code of the user and generate Token for user
 * @param details the details contain phone and generated code(the code is generated in loginRequest function)
 * @returns the generated token for user
 */
export const login: Login = async details => {
  const detailsIsRight = checkLogin({ details });
  detailsIsRight !== true && throwError(detailsIsRight[0].message);
  const {
    set: { phone, code },
    get,
  } = details;
  let token: any;

  /**
   *
   * @param user the user that is going to be login
   * @returns the created token
   */
  const createToken = async (user: IUser) => {
    payload.usersId = user._id;
    !user.isActive &&
      (await users.updateOne(
        { _id: new Bson.ObjectID(user._id) },
        { $set: { isActive: true, name: "unKnown", lastName: "unKnown" } },
      ));
    return {
      ...user,
      token: await create({ alg: "HS512", typ: "JWT" }, payload, key),
    };
  };
  /**
   *
   * @param code the generated code for the user,(user receives it as sms)
   * @param user the user that is going to be login
   * @returns if the code is right the token is returned
   */
  const verifyCode = async (code: number, user: IUser) => {
    const getCode = await getLoginToken({ userId: user!._id.toHexString() });
    if (code === Number(getCode)) {
      token = await createToken(user);
    } else {
      throwError("your code is not correct");
    }
    return token;
  };

  const numCode = Number(code);
  const numPhone = Number(refinePhone(phone.toString()));

  const user = await users.findOne(
    { phone: numPhone },
    { projection: get.user },
  );
  const createdToken = await verifyCode(numCode, user!);
  user ? createdToken : throwError("user not found");

  //delete token from token store
  await delLoginToken({ userId: user!._id.toHexString() });

  const returnObj: LoginReturn = {};
  get && get.user && (returnObj.user = user);
  get && get.token && (returnObj.token = createdToken.token);

  return returnObj;
};
