import { setLoginToken } from "./../../utils/services/inMemoryDb/login.ts";
import { Level, users } from "../../schemas/mod.ts";
import { createVerificationCode, throwError } from "../../utils/mod.ts";
import { refinePhone } from "../../utils/mod.ts";
import { checkLoginReq, SigningDetails } from "./loginRequest.type.ts";

export interface LoginRequestReturn {
  ok?: boolean;
  phone?: number;
}

type LoginRequest = (details: SigningDetails) => Promise<LoginRequestReturn>;

export const loginRequest: LoginRequest = async details => {
  const detailsIsRight = checkLoginReq({ details });
  detailsIsRight !== true && throwError(detailsIsRight[0].message);
  const {
    set: { phone },
    get,
  } = details;
  /**
   * the user enter its phone as number,
   * it changes to string for check the number validation by refinePhone function
   */
  const phoneNumber = Number(refinePhone(phone.toString()));

  // const phoneNumber = refinePhone(phone);
  !phoneNumber && throwError("your phone number is not correct");
  /**we check if the user is in DB before, if its not we create the new user */
  const foundedUser = (await users.findOne({ phone: phoneNumber })) || {
    _id: await users.insertOne({
      phone: phoneNumber,
      isActive: false,
      level: [Level.Normal],
    }),
    phone: phoneNumber,
  };
  /**
   *a code is created for the user and within 100 seconds this code is valid
   */
  const code = createVerificationCode();
  await setLoginToken({ userId: foundedUser!._id.toHexString() }, code);

  const returnObj: LoginRequestReturn = {};

  get && get.ok && (returnObj.ok = true);
  get && get.phone && (returnObj.phone = foundedUser.phone);

  return returnObj;
};
