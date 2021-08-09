import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";

const v = new FastestValidator();

export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        props: {},
      },
      get: {
        type: "forbidden",
        optional: true,
      },
    },
  },
};

export const checkGetBlogFirstPageDetails = v.compile(schema);

/**
 * Represent Input details
 * this is input of deleting BlogTag
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface getBlogFirstPageDetails {
  set: {
    //     _id: string;
  };
  get: {};
}
