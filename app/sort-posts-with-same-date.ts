import { Blog } from "contentlayer/generated";

export const sortPostsWithSameDate = (posts: Blog[]) => {
  // Sort posts with same date by slug, so that the order is deterministic
  return posts.sort((a, b) => {
    if (a.date === b.date) {
      return a.slug < b.slug ? 1 : -1;
    }
    return 0;
  });
};
