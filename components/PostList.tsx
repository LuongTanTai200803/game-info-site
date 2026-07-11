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
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  const categories = useMemo(() => {
    const uniqueCategories = posts
      .map((post) => post.category)
      .filter(Boolean);

    return ["Tất cả", ...new Set(uniqueCategories)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return posts.filter((post) => {
      const matchTitle =
        !normalizedKeyword ||
        post.title.toLowerCase().includes(normalizedKeyword);

      const matchCategory =
        selectedCategory === "Tất cả" ||
        post.category === selectedCategory;

      return matchTitle && matchCategory;
    });
  }, [posts, keyword, selectedCategory]);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Các Trick Lỏ</h1>

      <div className="mb-6">
        <div className="w-120 max-w-full">
          <input
            type="search"
            placeholder="Tìm bài viết..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="block w-full border rounded-lg px-4 py-3"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition ${
              selectedCategory === category
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

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