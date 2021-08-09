import {
  countries,
  ICountry,
  PuCountry,
  RCountry,
} from "../../../schemas/mod.ts";
import { BasePageSortDetail } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";
import { makePagination } from "../../../utils/mod.ts";
import { makeProjections } from "../../../utils/mod.ts";

type GetCountriesInput = {
  filter: Bson.Document;
  getObj: RCountry;
} & BasePageSortDetail<PuCountry>;

type GetCountries = ({
  filter,
  getObj,
  sort,
  pagination,
}: GetCountriesInput) => any;
export const getCountries: GetCountries = async ({
  filter,
  getObj,
  pagination,
  sort,
}) => {
  const projection = makeProjections(getObj, [], []);
  // const projection = makeProjections(getObj, [], []);
  const returnDocuments: any = await makePagination<ICountry>(
    countries,
    filter,
    projection,
    sort,
    pagination?.limit,
    pagination?.lastObjectId,
    pagination?.page,
  );

  return returnDocuments;
};
