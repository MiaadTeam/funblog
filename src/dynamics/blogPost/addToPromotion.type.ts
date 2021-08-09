import FastestValidator from "https://cdn.pika.dev/fastest-validator@^1.8.0";
const v = new FastestValidator();
export const schema = {
  details: {
    type: "object",
    props: {
      set: {
        type: "object",
        strict: true,
        props: {
          /**
           * The Id of the blogPost that is going to be add to promotions
           * min length is 2 , max length is 255
           */
          _id: { type: "string", min: 2, max: 255, optional: true },
        },
      },
    },
  },
};
export const checkAddToPromotions = v.compile(schema);
/**
 * Represent Input details
 * this is input of updating BlogPost
 * object "get" for specify user what wants to return
 * object "set" for input value involve(name)
 * @interface
 */
export interface addToPromotionsDetails {
  set: {
    //this is the _id of the blogCategory that we want to update
    _id: string;
  };
}
