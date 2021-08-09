import { cities, ICity, PuCity, RCity } from "../../../schemas/mod.ts";
import { BasePageSortDetail } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";
import { makePagination } from "../../../utils/mod.ts";
import { makeProjections } from "../../../utils/mod.ts";

/**
 * type of input include `{filter , get}`
 * `get` for specify what user want from City schema
 */
type GetCitiesInput = {
  filter: Bson.Document;
  getObj: RCity;
} & BasePageSortDetail<PuCity>;

/**
 * Represent type of  GetCities function.
 * @param param - param is include `{filter , get }` as GetCitiesInput
 * @returns - return Partial<ICity>[]
 */
type GetCities = ({
  filter,
  getObj,
  sort,
  pagination,
}: GetCitiesInput) => Promise<Partial<ICity>[]>;

/**
 * this is return the object that is got by `filter`
 * @param param - include `{filter , get}`
 * @returns
 */
export const getCities: GetCities = async ({
  filter,
  getObj,
  sort,
  pagination,
}) => {
  const projection = makeProjections(getObj, [], []); // make db projection of `get`

  const returnDocuments = await makePagination<PuCity>(
    cities,
    filter,
    projection,
    sort,
    pagination?.limit,
    pagination?.lastObjectId,
    pagination?.page,
  );
  return returnDocuments;
};
