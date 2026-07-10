import { getAllPosts } from '../../lib/posts';
import Link from 'next/link';
import Image from 'next/image';

export default async function PostsPage() {
  const posts = getAllPosts();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Tất cả bài viết</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <Link 
            key={post.slug} 
            href={`/posts/${post.slug}`}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition"
          >
            {post.image && (
              <Image 
                src={post.image} 
                alt={post.title}
                width={400}
                height={225}
                className="w-full h-48 object-cover"
              />
            )}
            
            <div className="p-4">
              <p className="text-sm text-gray-500">{new Date(post.date).toLocaleDateString('vi-VN')} • {post.category}</p>
              <h2 className="text-xl font-semibold mt-2 line-clamp-2">{post.title}</h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}