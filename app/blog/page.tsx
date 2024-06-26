import ListLayout from "@/layouts/ListLayoutWithTags";
import { allCoreContent, sortPosts } from "pliny/utils/contentlayer";
import { allBlogs } from "contentlayer/generated";
import { genPageMetadata } from "app/seo";
import { sortPostsWithSameDate } from "../sort-posts-with-same-date";

const POSTS_PER_PAGE = 5;

export const metadata = genPageMetadata({ title: "Blog" });

export default function BlogPage() {
  const posts = allCoreContent(sortPostsWithSameDate(sortPosts(allBlogs)));
  const pageNumber = 1;
  const filteredPosts = posts.filter(post => !post.hidden);
  const initialDisplayPosts = filteredPosts
    .slice(
      POSTS_PER_PAGE * (pageNumber - 1),
      POSTS_PER_PAGE * pageNumber
    );
  const pagination = {
    currentPage: pageNumber,
    totalPages: Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  };

  return (
    <ListLayout
      posts={filteredPosts}
      initialDisplayPosts={initialDisplayPosts}
      pagination={pagination}
      title="All Posts"
    />
  );
}
