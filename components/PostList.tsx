"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function PostList({ posts }) {
  const [keyword, setKeyword] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) =>
      post.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }, [posts, keyword]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      <h1 className="text-4xl font-bold mb-6">
        Tất cả bài viết
      </h1>

      <input
        type="text"
        placeholder="Tìm bài viết..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 mb-8"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {filteredPosts.map((post) => (
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
              <p className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString("vi-VN")} • {post.category}
              </p>

              <h2 className="text-xl font-semibold mt-2">
                {post.title}
              </h2>
            </div>
          </Link>
        ))}

      </div>

    </div>
  );
}