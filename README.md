# Game Info Site

Website tổng hợp hướng dẫn và cơ chế game được xây dựng bằng **Next.js + Decap CMS + Supabase Storage**.

Mục tiêu là giúp người chơi mới có thể tra cứu toàn bộ thông tin game mà không cần hỏi lại nhiều lần.

---

# Công nghệ sử dụng

- Next.js 16
- React
- Tailwind CSS
- Decap CMS
- Netlify Identity
- Netlify Git Gateway
- Supabase Storage
- GitHub
- Vercel (Website Public)

---

# Kiến trúc

```
                Người viết bài
                       │
                       ▼
               Netlify Identity
                       │
                       ▼
                Netlify Git Gateway
                       │
                       ▼
                   GitHub Repo
                  /            \
                 /              \
                ▼                ▼
          Nội dung MDX      Source Code
                │
                ▼
             Vercel
                │
                ▼
         Website Public

                ▲
                │
      Supabase Storage
      (Lưu toàn bộ ảnh)
```

---

# Chức năng

## Website Public

- Danh sách bài viết
- Chi tiết bài viết
- Tìm kiếm theo tên
- Lọc theo Category
- Responsive
- Render Markdown
- Hỗ trợ ảnh trong bài viết
- SEO Friendly

---

## CMS

Đường dẫn

```
/admin
```

Chức năng

- Đăng nhập bằng Netlify Identity
- Tạo bài viết
- Chỉnh sửa bài viết
- Xóa bài viết
- Upload ảnh lên Supabase
- Tự động commit lên GitHub

---

# Flow tạo bài viết

```
Đăng nhập

↓

Tạo bài

↓

Upload ảnh

↓

Supabase Storage

↓

Lấy Public URL

↓

Ghi vào Markdown

↓

Commit GitHub

↓

Vercel Deploy

↓

Website cập nhật
```

---

# Lưu trữ dữ liệu

## Bài viết

```
content/posts
```

Định dạng

```
MDX
```

Ví dụ

```md
---
title: Berserker
date: 2026-07-12
category: Warrior
image: https://xxxxx.supabase.co/storage/...
---

# Berserker

Nội dung...
```

---

## Ảnh

Lưu tại

```
Supabase Storage

Bucket:

game-images
```

Repo chỉ lưu URL ảnh.

Không lưu file ảnh trong GitHub.

---

# Tìm kiếm

Hỗ trợ

- Theo tiêu đề
- Theo Category

---

# Render Markdown

Website sử dụng

- React Markdown
- Remark GFM

Hỗ trợ

- Heading
- Danh sách
- In đậm
- In nghiêng
- Bảng
- Link
- Ảnh
- Checklist

---

# Deploy

## Website

Deploy

```
Vercel
```

Website Public

```
https://...
```

---

## CMS

Deploy

```
Netlify
```

Đường dẫn

```
/admin
```

---

# Vai trò từng dịch vụ

## GitHub

- Lưu Source Code
- Lưu bài viết MDX

---

## Netlify

Chỉ dùng

- Identity
- Git Gateway
- CMS

Không dùng để deploy Website Public.

---

## Supabase

Chỉ dùng

- Storage

Không dùng Database.

---

## Vercel

Chỉ dùng

- Build
- Deploy Website Public

---

# Cấu trúc thư mục

```
app/
components/
content/
    posts/
lib/
public/
    admin/
```

---

# Quy tắc bài viết

- Tiêu đề được phép có dấu.
- File Markdown sử dụng slug không dấu.
- Ảnh luôn upload lên Supabase.
- Không commit ảnh vào GitHub.
- Không sử dụng HTML nếu Markdown có thể biểu diễn được.

---

# Quy trình cập nhật

Người viết

↓

CMS

↓

GitHub Commit

↓

Vercel Deploy

↓

Website cập nhật

---

# Mục tiêu

- Dễ mở rộng
- Không cần Backend riêng
- Dễ thêm cộng tác viên
- Dễ bảo trì
- Dữ liệu lưu bằng Git
- Ảnh lưu riêng trên Storage
- Website tách biệt hoàn toàn khỏi CMS
