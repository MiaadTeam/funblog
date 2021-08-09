import { getPureDoc } from "./../../utils/mod.ts";
import { cities, ICity, states, users } from "../../schemas/mod.ts";
import { checkValidation } from "../../utils/mod.ts";
import { throwError } from "../../utils/mod.ts";
import { Context } from "./../utils/context.ts";
import { checkUpdateCity, IUpdateCityDetails } from "./updateCity.type.ts";
import { getCity } from "./sharedFunctions/getCity.ts";
import { Bson } from "../../utils/deps.ts";
export type UpdateCity = (
  details: IUpdateCityDetails,
  context: Context,
) => Promise<Partial<ICity>>;

/**
 * Represent updateCity (update city in db)
 * after validate detail,we check if any field do exist so it adds to object dynamically.
 * at the end update the object with `$set` so we just update field that get from input.
 *
 * @function
 * @param details - detail of request
 * @param context - context is optional
 */

export const updateCityFn: UpdateCity = async (details, context) => {
  //todo must be add authorization
  /** check whether the details(input) is right or not*/
  checkValidation(checkUpdateCity, { details });
  const {
    set: { _id, name, enName, geometries, stateId },
    get,
  } = details;

  const cityId = new Bson.ObjectID(_id);
  //find city with Id
  const city = await cities.findOne({
    _id: cityId,
  });

  const pureCity =
    city === undefined
      ? throwError("city not found")
      : getPureDoc({
          IDocument: city,
          puProps: ["name", "enName", "geometries"],
        });

  const updatedCity: any = {}; // we declare an empty object then add a field one by one if the field is in input
  // if (name) {
  //   updatedCity.name = name;
  //   pureCity!.name = name;
  // }
  // if (enName) {
  //   updatedCity.enName = enName;
  //   pureCity.enName = enName;
  // }
  // if (geometries) {
  //   updatedCity.geometries = { type: "Polygon", coordinates: geometries };
  //   pureCity.geometries = { type: "Polygon", coordinates: geometries };
  // }
  if (stateId) {
    updatedCity.state = await states.findOne(
      { _id: new Bson.ObjectID(stateId) },
      { projection: { _id: 1, name: 1, enName: 1 } },
    );

    //delete city from list cities of Prior IState
    await states.updateOne(
      { _id: city?.state._id },
      { $pull: { cities: { _id: city?._id } } },
    );
  }
  // update with `$set` operator in db
  await cities.updateOne({ _id: cityId }, { $set: updatedCity });
  //if these pure field change then update in other models
  if (name || enName || geometries) {
    //update city that save embedded in other schema

    await states.updateOne(
      {
        "cities._id": cityId,
      },
      {
        $set: { "cities.$": pureCity },
      },
    );

    //update city Field in user
    await users.updateMany(
      { "city._id": cityId },
      {
        $set: {
          city: pureCity,
        },
      },
    );

    // //update city Field in store
    // await shops.updateMany(
    //   { "city._id": cityId },
    //   {
    //     $set: {
    //       city: pureCity,
    //     },
    //   },
    // );
  }

  return get ? getCity({ _id: cityId, get }) : { _id: cityId };
};
