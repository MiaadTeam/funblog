import { checkValidation } from "./../../utils/mod.ts";
import { ICity } from "../../schemas/mod.ts";
import { Context } from "../utils/context.ts";
import { getCitiesDetails, checkCitiesDetails } from "./getCities.type.ts";
import { getCities } from "./sharedFunctions/getCities.ts";
import { Bson } from "../../utils/deps.ts";
type GetCitiesFn = (
  details: getCitiesDetails,
  context: Context,
) => Promise<Partial<ICity>[]>;

/**
 * @function
 * Represent get blog tags(tags with desired names)
 * @param details
 * @param context
 */
export const getCitiesFn: GetCitiesFn = async (details, context) => {
  // !context ? emptyTokenError() : null;

  /**check user is authenticated */
  // const user = await isAuthFn(context!.token!);

  /** check whether the details(input) is right or not*/
  checkValidation(checkCitiesDetails, { details });

  const {
    set: { name, sort, pagination },
    get,
  } = details;

  let filter: Bson.Document = {};

  if (name) filter.name = { $regex: name };
  const foundCities = await getCities({
    filter,
    getObj: get,
    sort: sort,
    pagination: {
      limit: pagination?.limit,
      page: pagination?.page,
      lastObjectId: pagination?.lastObjectId,
    },
  });
  return foundCities!;
};
