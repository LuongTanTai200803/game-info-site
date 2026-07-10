import { getAllPosts } from '../../lib/posts';
import PostList from "../../components/PostList";


export default function PostsPage() {
  const posts = getAllPosts();

  return <PostList posts={posts} />;
}
