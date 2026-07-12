import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
  const h = window.h;
  const createClass = window.createClass;

  if (!window.CMS || !h || !createClass) {
    console.error("Decap CMS globals are not available.");
    return;
  }

  if (
    !window.SUPABASE_URL ||
    !window.SUPABASE_ANON_KEY ||
    !window.SUPABASE_BUCKET
  ) {
    console.error(
      "Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_BUCKET."
    );
    return;
  }

  const client = createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  async function uploadImage(file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error("Chỉ hỗ trợ JPG, PNG, WEBP hoặc GIF.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error("Ảnh không được lớn hơn 5 MB.");
    }

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath =
      "posts/" +
      Date.now() +
      "-" +
      crypto.randomUUID() +
      "." +
      extension;

    const { error: uploadError } = await client.storage
      .from(window.SUPABASE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = client.storage
      .from(window.SUPABASE_BUCKET)
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error("Không lấy được URL ảnh.");
    }

    return data.publicUrl;
  }

  const SupabaseImageControl = createClass({
    getInitialState() {
      return {
        uploading: false,
        error: "",
      };
    },

    async handleUpload(event) {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      this.setState({
        uploading: true,
        error: "",
      });

      try {
        const publicUrl = await uploadImage(file);

        this.props.onChange(publicUrl);
      } catch (error) {
        console.error(error);

        this.setState({
          error:
            error instanceof Error
              ? error.message
              : "Upload ảnh thất bại.",
        });
      } finally {
        this.setState({
          uploading: false,
        });

        event.target.value = "";
      }
    },

    handleRemove() {
      /*
       * Chỉ xóa URL khỏi bài viết.
       * File trong Supabase vẫn được giữ lại.
       */
      this.props.onChange("");
    },

    render() {
      const { uploading, error } = this.state;
      const value = this.props.value || "";

      const elements = [
        h("input", {
          key: "file-input",
          type: "file",
          accept: "image/jpeg,image/png,image/webp,image/gif",
          disabled: uploading,
          onChange: this.handleUpload.bind(this),
        }),

        uploading
          ? h(
              "p",
              {
                key: "uploading",
                style: {
                  marginTop: "8px",
                },
              },
              "Đang upload ảnh..."
            )
          : null,

        error
          ? h(
              "p",
              {
                key: "error",
                style: {
                  color: "#dc2626",
                  marginTop: "8px",
                },
              },
              error
            )
          : null,
      ];

      if (value) {
        elements.push(
          h("img", {
            key: "preview",
            src: value,
            alt: "Ảnh đã upload",
            style: {
              display: "block",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "320px",
              objectFit: "contain",
              marginTop: "12px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            },
          }),

          h(
            "a",
            {
              key: "image-link",
              href: value,
              target: "_blank",
              rel: "noopener noreferrer",
              style: {
                display: "block",
                marginTop: "8px",
                wordBreak: "break-all",
              },
            },
            "Mở ảnh trong tab mới"
          ),

          h(
            "button",
            {
              key: "remove-button",
              type: "button",
              onClick: this.handleRemove.bind(this),
              style: {
                display: "block",
                marginTop: "10px",
                padding: "8px 12px",
                border: "1px solid #dc2626",
                borderRadius: "6px",
                color: "#dc2626",
                background: "transparent",
                cursor: "pointer",
              },
            },
            "Xóa ảnh khỏi bài viết"
          )
        );
      }

      return h(
        "div",
        {
          style: {
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          },
        },
        elements.filter(Boolean)
      );
    },
  });

  const SupabaseImagePreview = createClass({
    render() {
      const value = this.props.value;

      if (!value) {
        return h("p", {}, "Chưa có ảnh");
      }

      return h("img", {
        src: value,
        alt: "Preview",
        style: {
          display: "block",
          maxWidth: "100%",
          height: "auto",
          margin: "24px auto",
          borderRadius: "8px",
        },
      });
    },
  });

  /*
   * Widget dùng cho ảnh bìa và cũng được sử dụng
   * trong cửa sổ chèn ảnh của Markdown editor.
   */
  window.CMS.registerWidget(
    "supabase-image",
    SupabaseImageControl,
    SupabaseImagePreview
  );

  /*
   * Nút chèn ảnh vào giữa nội dung Markdown.
   *
   * Sau khi chọn ảnh, Decap chèn:
   * ![Mô tả ảnh](https://...)
   * vào đúng vị trí con trỏ trong phần nội dung.
   */
  window.CMS.registerEditorComponent({
    id: "supabase-inline-image",
    label: "Chèn ảnh Supabase",

    fields: [
      {
        label: "Ảnh",
        name: "src",
        widget: "supabase-image",
      },
      {
        label: "Mô tả ảnh",
        name: "alt",
        widget: "string",
        required: false,
        hint: "Mô tả ngắn nội dung ảnh.",
      },
    ],

    pattern: /^!\[([^\]]*)\]\(([^)]+)\)$/,

    fromBlock(match) {
      return {
        alt: match[1] || "",
        src: match[2] || "",
      };
    },

    toBlock(data) {
      const src = data.src || "";
      const alt = data.alt || "";

      return `![${alt}](${src})`;
    },

    toPreview(data) {
      const src = data.src || "";
      const alt = data.alt || "";

      if (!src) {
        return "<p>Chưa có ảnh</p>";
      }

      return `
        <figure style="margin: 24px 0; text-align: center;">
          <img
            src="${src}"
            alt="${alt}"
            style="max-width: 100%; height: auto; border-radius: 8px;"
          />
          ${
            alt
              ? `<figcaption style="margin-top: 8px; color: #6b7280;">${alt}</figcaption>`
              : ""
          }
        </figure>
      `;
    },
  });

  console.log("Supabase image widget and inline image component registered.");
})();