import type { ServerRequest } from "https://deno.land/std@0.101.0/http/server.ts";
import { throwError } from "./mod.ts";
import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { Context } from "../dynamics/utils/context.ts";
import {
  BlogCategoryDoit,
  BlogPostDoit,
  BlogTagDoit,
  CityDoit,
  CommentDoit,
  CountryDoit,
  StateDoit,
  UserDoit,
  // CategoryDoit,
} from "../dynamics/mod.ts";
import { BlogFirstPageDoit } from "../statics/mod.ts";

const v = new FastestValidator();
const check = v.compile({
  contents: {
    type: "enum",
    values: ["static", "dynamic"],
  },
});

// const check = v.compile({
//   wants: {
//     type: "object",
//     props: {
//       model: {
//         type: "enum",
//         values: [
//           "User",
//           "City",
//           "State",
//           "Category",
//           "Country",
//           "BlogTag",
//           "BlogCategory",
//           "Comment",
//           "BlogPost",
//           "BlogFirstPage",
//           "WareType",
//           "Ware",
//           "ShoppingCart",
//           "Order",
//           "Shop",
//         ],
//       },
//     },
//   },
// });

export type StaticModels = "BlogFirstPage";

export type DynamicModels =
  | "BlogCategory"
  | "BlogPost"
  | "BlogTag"
  // | "Category"
  // | "Center"
  | "City"
  | "Comment"
  | "Country"
  // | "dish"
  // | "menu"
  // | "order"
  | "State"
  // | "table"
  | "User";

export type Doits =
  | BlogCategoryDoit
  | BlogPostDoit
  | BlogTagDoit
  | CityDoit
  | CommentDoit
  | CountryDoit
  | StateDoit
  | UserDoit
  | BlogFirstPageDoit;

export interface Body {
  contents: "static" | "dynamic";
  wants: {
    model: DynamicModels | StaticModels;
    doit: Doits;
  };
  details: any;
}

// /**
//  * this interface inherits from Body and make context and place token in context(in context we have token & user)
//  * @interface
//  */
// interface extraBody extends Body {
//   context: {
//     token: string | null;
//     user?: IUser;
//   };
// }

/**
 *
 * type of parsed body function
 * this is body
 *
 */

const checkContentType = (conType: string | null) =>
  (conType === null || !conType.includes("application/json")) &&
  throwError(" your body is incorrct ");

type ParsedBody = Promise<Body & { context: Context }>;

export const parsBody = async (req: ServerRequest): ParsedBody => {
  checkContentType(req.headers.get("content-type"));

  const decoder = new TextDecoder();
  const body = await Deno.readAll(req.body);
  const decodedBody = decoder.decode(body);
  const parsedBody: Body = JSON.parse(decodedBody);
  const context: Context = {
    token: req.headers.get("token") || "",
  };

  const checkBody = (body: Body) => {
    const isRight = check(body);
    return isRight === true
      ? isRight
      : throwError(
          `the error is here ${isRight[0].message} but get ${isRight[0].actual}`
        );
  };

  return req.method === "POST" && req.url === "/funql" && checkBody(parsedBody)
    ? { ...parsedBody, context }
    : throwError("do not provide wants on Body");
};
