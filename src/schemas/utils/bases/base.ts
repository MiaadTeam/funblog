import { Bson } from "../../../utils/deps.ts";
import { fieldType } from "./../fieldType.ts";
import { RType } from "./../rType.ts";

export interface Base {
  _id: Bson.ObjectID;
  // createAt: Date;
  updateAt?: Date;
}

export interface ObjectID {
  _id: Bson.ObjectID;
}
export interface RBase {
  _id?: RType;
  createAt?: RType;
  updateAt?: RType;
  // version: number;
  // documnet?: any;
}
export const baseSelectableFields = () => ({
  _id: fieldType,
  // createAt: fieldType,
  updateAt: fieldType,
});
