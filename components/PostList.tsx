"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Post } from "../lib/posts";

type PostListProps = {
  posts: Post[];
};

export default function PostList({ posts }: PostListProps) {
  const [keyword, setKeyword] = useState("");

  const filteredPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    if (!normalizedKeyword) {
      return posts;
    }

    return posts.filter((post) =>
      post.title.toLowerCase().includes(normalizedKeyword)
    );
  }, [posts, keyword]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Tất cả bài viết</h1>

      <input
        type="search"
        placeholder="Tìm bài viết..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full border rounded-lg px-4 py-3 mb-8"
      />

      {filteredPosts.length === 0 ? (
        <p className="text-gray-500">
          Không tìm thấy bài viết phù hợp.
        </p>
      ) : (
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
                  {post.date
                    ? new Date(post.date).toLocaleDateString("vi-VN")
                    : "Chưa có ngày"}
                  {" • "}
                  {post.category}
                </p>

                <h2 className="text-xl font-semibold mt-2 line-clamp-2">
                  {post.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}