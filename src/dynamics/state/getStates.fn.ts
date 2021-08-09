import { checkStatesDetails, getStatesDetails } from "./getStates.type.ts";
import { checkValidation } from "./../../utils/mod.ts";
import { IState } from "../../schemas/mod.ts";
import { Context } from "../utils/context.ts";
import { getStates } from "./sharedFunctions/getStates.ts";
import { Bson } from "../../utils/deps.ts";
type GetCountriesFn = (
  details: getStatesDetails,
  context: Context,
) => Promise<Partial<IState>[]>;

/**
 * @function
 * Represent get blog tags(tags with desired names)
 * @param details
 * @param context
 */
export const getStatesFn: GetCountriesFn = async (details, context) => {
  // !context ? emptyTokenError() : null;

  /**check user is authenticated */
  // const user = await isAuthFn(context!.token!);

  /** check whether the details(input) is right or not*/
  checkValidation(checkStatesDetails, { details });

  const {
    set: { name, sort, pagination },
    get,
  } = details;

  let filter: Bson.Document = {};

  if (name) filter.name = { $regex: name };
  const foundStates = await getStates({
    filter,
    getObj: get,
    sort: sort,
    pagination: {
      limit: pagination?.limit,
      page: pagination?.page,
      lastObjectId: pagination?.lastObjectId,
    },
  });
  return foundStates!;
};
