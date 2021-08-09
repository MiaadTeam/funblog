import { states, IState, PuState, RState } from "../../../schemas/mod.ts";
import { BasePageSortDetail } from "../../../utils/mod.ts";
import { Bson } from "../../../utils/deps.ts";
import { makePagination } from "../../../utils/mod.ts";
import { makeProjections } from "../../../utils/mod.ts";

type GetCountriesInput = {
  filter: Bson.Document;
  getObj: RState;
} & BasePageSortDetail<PuState>;

type GetCountries = ({
  filter,
  getObj,
  sort,
  pagination,
}: GetCountriesInput) => any;
export const getStates: GetCountries = async ({
  filter,
  getObj,
  pagination,
  sort,
}) => {
  const projection = makeProjections(getObj, [], []);
  // const projection = makeProjections(getObj, [], []);
  const returnDocuments: any = await makePagination<IState>(
    states,
    filter,
    projection,
    sort,
    pagination?.limit,
    pagination?.lastObjectId,
    pagination?.page,
  );

  return returnDocuments;
};
