import { usePosts } from "./hooks";

import { PostItem } from "./_components/post-item";

export const PostsList = () => {
  const { data: postPages, isLoading: postsLoading } = usePosts();

  if (postsLoading || !postPages) {
    return <>loading . . .</>;
  }

  const posts = postPages?.pages.flatMap((page) => page.posts) ?? [];

  return (
    <div>
      {posts.map((post, _) => (
        <PostItem key={post.id} post={post} />
      ))}
    </div>
  );
};
