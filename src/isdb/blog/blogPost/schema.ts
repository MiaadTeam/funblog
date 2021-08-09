import { ObjectID } from "https://deno.land/x/mongo@v0.21.2/bson/mod.ts";

export const blogPostSchema = {
  blogPost: {
    type: "object",
    props: {
      _id: { type: "objectID", ObjectID },
      title: { type: "string", min: 5, max: 250 },
      summary: { type: "string", min: 5, max: 250 },
      photo: { type: "string", min: 5, max: 250 },
      content: { type: "string", min: 5 },
      writer: { type: "string", min: 5, max: 250 },
      blogCategoryName: { type: "string", min: 5, max: 250 },
      // comments: "object",
      // props: {
      //   user: { type: "string", min: 5, max: 250 },
      //   content: { type: "string", min: 5, max: 250 },
      //   optional: true,
      // },
      blogTags: { type: "array", items: "string", optional: true },
      //       TODO:relatedPost
    },
  },
};

// export const blogPostInit = {
//   post: {},
// };
