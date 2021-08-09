import { throwError } from "./../../utils/throwErr.ts";
import db from "../../../db.ts";
import { IUser, users } from "../../schemas/mod.ts";

async function createUser(): Promise<IUser[]> {
  const usrArr = [
    {
      name: "ghost",
      lastName: "ghost",
      phone: 9381028800,
      gender: "Male",
      level: ["Admin"],
      isActive: true,
    },
    {
      name: "ghost",
      lastName: "ghost",
      phone: 9185085861,
      gender: "Female",
      level: ["Admin"],
      isActive: true,
    },
    {
      name: "ghost",
      lastName: "ghost",
      phone: 9185893605,
      gender: "Male",
      level: ["Admin"],
      isActive: true,
    },
  ];
  await users.insertMany(usrArr);
  return await users
    .find({
      phone: { $in: [9381028800, 9185085861, 9185893605] },
    })
    .toArray();
}
export async function createGhostUser(): Promise<IUser[]> {
  const collNames = await (await db.listCollectionNames()).includes(users.name);

  return collNames === false
    ? await createUser()
    : throwError("there are users in DB, ghost User cant be created");
}
