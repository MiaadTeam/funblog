import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
import { BlogCategoryDoit, blogCategoryFns } from "./blogCategory/mod.ts";
import { CommentDoit, commentFns } from "./blogComment/mod.ts";
import { BlogPostDoit, blogPostFns } from "./blogPost/mod.ts";
import { BlogTagDoit, blogTagFns } from "./blogTag/mod.ts";
import { CityDoit, cityFns } from "./city/mod.ts";
import { CountryDoit, countryFns } from "./country/mod.ts";
import { StateDoit, stateFns } from "./state/mod.ts";
import { UserDoit, usrFns } from "./user/mod.ts";
// import { CategoryDoit, categoryFns } from "./category/mod.ts";
import { Context } from "./utils/mod.ts";
import { Doits, DynamicModels, throwError } from "../utils/mod.ts";

const v = new FastestValidator();
const check = v.compile({
  model: {
    type: "enum",
    values: [
      "User",
      "City",
      "State",
      "Category",
      "Country",
      "BlogTag",
      "BlogCategory",
      "Comment",
      "BlogPost",
    ],
  },
});

export const dynamicFns = (
  model: DynamicModels,
  doit: Doits,
  details: any,
  context: Context
) => {
  const checkModel = check({ model });
  return checkModel === true
    ? {
        ["User"]: async () => await usrFns(doit as UserDoit, details, context),
        ["Country"]: async () =>
          await countryFns(doit as CountryDoit, details, context),
        ["City"]: async () => await cityFns(doit as CityDoit, details, context),
        ["State"]: async () =>
          await stateFns(doit as StateDoit, details, context),
        ["BlogTag"]: async () =>
          await blogTagFns(doit as BlogTagDoit, details, context),
        ["BlogCategory"]: async () =>
          await blogCategoryFns(doit as BlogCategoryDoit, details, context),
        ["Comment"]: async () =>
          await commentFns(doit as CommentDoit, details, context),
        ["BlogPost"]: async () =>
          await blogPostFns(doit as BlogPostDoit, details, context),
        // ["Category"]: async () =>
        // await categoryFns(doit as CategoryDoit, details, context),
      }[model]()
    : throwError(checkModel[0].message);
};

export * from "./blogCategory/mod.ts";
export * from "./blogComment/mod.ts";
export * from "./blogPost/mod.ts";
export * from "./blogTag/mod.ts";
export * from "./city/mod.ts";
export * from "./country/mod.ts";
export * from "./state/mod.ts";
export * from "./user/mod.ts";
export * from "./utils/mod.ts";
// export * from "./category/mod.ts";
