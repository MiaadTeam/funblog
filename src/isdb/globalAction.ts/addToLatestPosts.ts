export const addToLatestPosts = async <T, U>(
  blogPost: T,
  desiredSlice: any,
  desiredType: any,
  latestPosts: any,
): Promise<any> => {
  const { getState, validate, setState } = desiredSlice;
  const db = getState();
  const latestArrLength = db.latestPosts.length;
  let newDb: typeof desiredType;
  /**if the latest post array exceed from 20, then remove the first item from array
   * then add the new post to the end of the array
   */
  if (latestArrLength < 4) {
    newDb = {
      ...db,
      latestPosts: [...db.latestPosts, blogPost],
    };
  } else {
    db.latestBlogPosts.shift();
    newDb = {
      ...db,
      latestBlogPosts: [...db.latestBlogPosts, blogPost],
    };
  }
  newDb.latestBlogPosts.reverse();
  await validate(newDb);
  await setState(newDb);
};
