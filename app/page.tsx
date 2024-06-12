import { sortPosts, allCoreContent } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import Main from "./Main";
import { sortPostsWithSameDate } from "./sort-posts-with-same-date";

export default async function Page() {
  const sortedPosts = sortPostsWithSameDate(sortPosts(allBlogs));
  const posts = allCoreContent(sortedPosts);
  return <Main posts={posts}/>;
}
