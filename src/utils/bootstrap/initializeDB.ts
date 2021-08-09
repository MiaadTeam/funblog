import { initializeBlogFirstPage } from "./../../isdb/blog/blogFirstPage/actions/mod.ts";
import { getPureDoc, throwError } from "./../../utils/mod.ts";
export { faker } from "https://deno.land/x/deno_faker@v1.0.0/mod.ts";
import {
  Level,
  IBlogTag,
  Gender,
  IUser,
  users,
  CommentStatus,
  PuUser,
  IState,
  ICity,
  states,
  cities,
  countries,
  PuCountry,
  IBlogPost,
  IBlogCategory,
  blogTags,
  blogCategories,
  blogPosts,
  IComment,
  comments,
  PuRelCountry,
  PuRelState,
  PuRelCity,
} from "./../../schemas/mod.ts";
import { faker } from "https://deno.land/x/deno_faker@v1.0.0/mod.ts";
import { Bson } from "../deps.ts";
import db from "../../../db.ts";
/**
 * generate a value between min and max
 * @param min
 * @param max
 */
const rand = (min: number, max: number) =>
  Math.round(Math.random() * (max - min)) + min;

/**
 * @function
 * an function for create fake data in database
 */

/**
 * @function
 * @async
 * generate new data and insert it in database
 */
export const handleFakeDb = async () => {
  faker.setLocale("en");
  faker.seed(Date.now());

  //construct Country
  const countryArr: PuCountry[] = [];
  for (let i = 0; i < rand(4, 20); i++) {
    countryArr.push({
      _id: new Bson.ObjectID(),
      name: faker.address.county(),
      enName: `country${i}`,
      geometries: {
        type: "Polygon",
        coordinates: [
          [1, 1],
          [2, 2],
          [1, 1],
        ],
      },
    });
  }

  // pureCountry
  const country = countryArr[rand(0, countryArr.length - 1)];
  const pureCountry = await getPureDoc({
    IDocument: country,
    puProps: ["name", "enName"],
  });
  const puCountryDoc = pureCountry! as PuRelCountry;

  //construct state
  const stateArr: IState[] = [];
  for (let i = 0; i < rand(4, 20); i++) {
    stateArr.push({
      _id: new Bson.ObjectID(),
      name: faker.address.state(),
      enName: `state${i}`,
      country: countryArr[rand(0, countryArr.length - 1)],
      geometries: {
        type: "Polygon",
        coordinates: [
          [1, 1],
          [2, 2],
          [1, 1],
        ],
      },
    });
  }

  // pureState
  const state = stateArr[rand(0, stateArr.length - 1)];

  const pureState = await getPureDoc({
    IDocument: state,
    puProps: ["name", "enName"],
  });
  const puStateDoc = pureState! as PuRelState;

  //construct city
  const cityArr: ICity[] = [];
  for (let i = 0; i < rand(4, 20); i++) {
    cityArr.push({
      _id: new Bson.ObjectID(),
      name: faker.address.city(),
      enName: `city${i}`,
      state: stateArr[rand(0, stateArr.length - 1)],
      country: countryArr[rand(0, countryArr.length - 1)],
      geometries: {
        type: "Polygon",
        coordinates: [
          [1, 1],
          [2, 2],
          [1, 1],
        ],
      },
    });
  }
  // pureCity
  const city = cityArr[rand(0, cityArr.length - 1)];
  const pureCity = await getPureDoc({
    IDocument: city,
    puProps: ["name", "enName"],
  });
  const puCityDoc = pureCity! as PuRelCity;

  //construct user
  const userArr: IUser[] = [];
  for (let i = 0; i < rand(4, 30); i++) {
    userArr.push({
      _id: new Bson.ObjectID(),
      name: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.phoneNumber("965########"),
      gender: Gender.Male,
      isActive: true,
      birthDate: faker.date.past(),
      postalCode: "123456",
      creditCardNumber: 123456,
      level: [Level.Normal],
      addresses: {
        country: puCountryDoc!,
        state: puStateDoc!,
        city: puCityDoc!,
        addressTxt: "this is address text",
      },

      updateAt: faker.date.past(),
    });
  }
  //assign admin role to some users
  for (let i = 0; i < rand(1, userArr.length - 2); i++) {
    const user = userArr[rand(0, userArr.length - 1)];
    user.level.push(Level.Admin);
  }

  //construct blogCategory
  const blogCategoryArr: IBlogCategory[] = [];
  for (let i = 0; i < rand(4, 20); i++) {
    blogCategoryArr.push({
      _id: new Bson.ObjectID(),
      name: `کتگوری${i}`,
      enName: `blogCategory${i}`,
      icon: faker.image.imageUrl(),
      description: faker.lorem.sentence(),
      updateAt: faker.date.past(),
    });
  }

  //construct blogTag
  const blogTagArr: IBlogTag[] = [];
  for (let i = 0; i < rand(4, 10); i++) {
    blogTagArr.push({
      _id: new Bson.ObjectID(),
      updateAt: faker.date.past(),
      name: `blogTag${i}`,
    });
  }
  //construct blogPost
  const blogPostArr: IBlogPost[] = [];
  for (let i = 0; i < rand(20, 30); i++) {
    const user = userArr[rand(0, userArr.length - 1)];
    const pureUser = await getPureDoc({
      IDocument: user,
      puProps: [
        "name",
        "lastName",
        "phone",
        "gender",
        "email",
        "postalCode",
        "creditCardNumber",
        "level",
      ],
    });
    const aPureUser = pureUser as PuUser;

    const blogCategory = countryArr[rand(0, countryArr.length - 1)];
    const pureCategory = await getPureDoc({
      IDocument: blogCategory,
      puProps: ["name", "enName", "icon", "description"],
    });
    const category = pureCategory! as PuCountry;

    blogPostArr.push({
      _id: new Bson.ObjectID(),
      updateAt: faker.date.past(),
      title: `post${i}`,
      summary: faker.lorem.sentence(4),
      content: faker.lorem.sentence(),
      photo: faker.image.imageUrl(),
      totalViews: faker.random.number({ min: 10, max: 100 }),
      totalComments: faker.random.number({ min: 10, max: 100 }),
      totalLikes: faker.random.number({ min: 10, max: 100 }),
      author: aPureUser!,
      blogCategory: category,
    });
  }

  //construct blogComment
  const blogCommentArr: IComment[] = [];
  for (let i = 0; i < rand(4, 10); i++) {
    const user = userArr[rand(0, userArr.length - 1)];
    const pureUser = await getPureDoc({
      IDocument: user,
      puProps: ["name", "lastName", "phone", "gender", "email"],
    });
    const user1 = pureUser! as PuUser;

    blogCommentArr.push({
      _id: new Bson.ObjectID(),
      updateAt: faker.date.past(),
      content: faker.lorem.sentence(),
      blogCommentStatus: CommentStatus.ACCEPT,
      user: user1!,
      // replierBlogCommentRefs: Bson.ObjectID[],
      // parentId: Bson.ObjectID,
      blogPostId: blogPostArr[1]._id!,
    });

    //=======================now insert new data to db=====================
    const collName = await db.listCollectionNames();

    collName.includes(users.name) && (await users.drop());
    await users.insertMany(userArr);

    collName.includes(countries.name) && (await countries.drop());
    await countries.insertMany(countryArr);

    collName.includes(states.name) && (await states.drop());
    await states.insertMany(stateArr);

    collName.includes(cities.name) && (await cities.drop());
    await cities.insertMany(cityArr);

    collName.includes(blogTags.name) && (await blogTags.drop());
    await blogTags.insertMany(blogTagArr);

    collName.includes(blogCategories.name) && (await blogCategories.drop());
    await blogCategories.insertMany(countryArr);

    collName.includes(blogPosts.name) && (await blogPosts.drop());
    await blogPosts.insertMany(blogPostArr);

    collName.includes(comments.name) && (await comments.drop());
    await comments.insertMany(blogCommentArr);

    console.log(`
  fake data was created successfully
  -----------------------------------
  `);

    try {
      Deno.removeSync("staticFiles/blogFirstPage.json");
    } catch (err) {
      console.error(err);
    }

    // await Deno.remove("staticFiles/blogFirstPage.json");
    await initializeBlogFirstPage();
    console.log(`
  fake data for IDSB (blogHomesPage) was created successfully
  -----------------------------------
  `);
  }
};
