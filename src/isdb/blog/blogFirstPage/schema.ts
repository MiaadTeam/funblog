import { ObjectID } from "../../../utils/deps.ts";

export const firstPageSchema = {
  promotionBlogPosts: {
    type: "array",
    max: 6,
    items: {
      type: "object",
      props: {
        _id: { type: "objectID", ObjectID },
        title: { type: "string", min: 5, max: 250 },
        summary: "string",
        photo: "string",
      },
    },
  },
  latestBlogPosts: {
    type: "array",
    max: 20,
    items: {
      type: "object",
      props: {
        _id: { type: "objectID", ObjectID },
        title: "string",
        summary: "string",
        blogCategoryName: "string",
        authorName: "string",
        totalComments: "number",
        photo: "string",
        // createdAt: "string",
      },
    },
  },
  popularBlogPosts: {
    type: "array",
    max: 10,
    items: {
      type: "object",
      props: {
        _id: { type: "objectID", ObjectID },
        title: "string",
        photo: "string",
        totalLikes: "number",
      },
    },
  },
};

export const firstPageInit = {
  promotionBlogPosts: [],
  latestBlogPosts: [],
  popularBlogPosts: [],
};
