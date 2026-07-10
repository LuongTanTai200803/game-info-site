import { getAllPosts } from '../../lib/posts';
import Link from 'next/link';
import Image from 'next/image';
import PostList from "../../components/PostList";


export default function PostsPage() {
  const posts = getAllPosts();

  return <PostList posts={posts} />;
}
