import { IState } from "../../schemas/mod.ts";
import { Bson } from "../../utils/deps.ts";
import { throwError } from "../../utils/mod.ts";
import { Context } from "../utils/context.ts";
import { checkGetState, IGetStateDetails } from "./getState.type.ts";
import { getState } from "./sharedFunctions/getState.ts";
import { getStates } from "./sharedFunctions/getStates.ts";

type GetStateFn = (
  details: IGetStateDetails,
  context: Context,
) => Promise<Partial<IState>>;

/**
 * @function
 * Represent getWareModel (get wareGroup to db)
 * @param details
 * @param context
 */
export const getStateFn: GetStateFn = async (details, context) => {
  //todo must be add authorization

  // const user = token
  //   ? await isAuthFn(token)
  //   : throwError("your token is empty");
  // await isAdminFn(user);
  const detailsIsRight = checkGetState({ details });
  detailsIsRight !== true && throwError(detailsIsRight[0].message);
  const {
    set: { name, enName, _id, countryId, pagination, sort },
    get,
  } = details;
  const query: any = {};
  if (_id) return getState({ _id: new Bson.ObjectID(_id), get: get });

  if (name) query.name = { $regex: name };

  if (enName) query.enName = { $regex: enName };

  if (countryId) query["country._id"] = new Bson.ObjectID(countryId);

  return await getStates({
    filter: query,
    getObj: get,
    sort: sort,
    pagination: {
      limit: pagination.limit,
      page: pagination.page,
      lastObjectId: pagination.lastObjectId,
    },
  });
};
