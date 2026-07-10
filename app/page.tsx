import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>Game Info Site</h1>
      <p>Trang tổng hợp thông tin và hướng dẫn game.</p>

      <Link href="/posts">Xem tất cả bài viết</Link>
    </main>
  );
}