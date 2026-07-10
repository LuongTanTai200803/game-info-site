import { getPostBySlug, getAllPosts } from '../../../lib/posts';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;

  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <p className="text-sm text-gray-500">
          {post.date} • {post.category}
        </p>
        <h1 className="text-4xl font-bold mt-2">{post.title}</h1>
      </div>

      {post.image && (
        <Image 
          src={post.image} 
          alt={post.title}
          width={800}
          height={450}
          className="w-full rounded-xl mb-8 object-cover"
          priority
        />
      )}

      <div 
        className="prose prose-lg max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}