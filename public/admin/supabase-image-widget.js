import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
  const client = createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );

  function SupabaseImageControl(props) {
    const React = window.React;
    const [uploading, setUploading] = React.useState(false);
    const [error, setError] = React.useState("");

    async function handleUpload(event) {
      const file = event.target.files?.[0];

      if (!file) return;

      setUploading(true);
      setError("");

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Chỉ được chọn file ảnh");
        }

        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

        const filePath =
          `posts/${Date.now()}-${crypto.randomUUID()}.${extension}`;

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
          throw new Error("Không lấy được URL ảnh");
        }

        props.onChange(data.publicUrl);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Upload thất bại");
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    }

    return React.createElement(
      "div",
      null,

      React.createElement("input", {
        type: "file",
        accept: "image/*",
        disabled: uploading,
        onChange: handleUpload,
      }),

      uploading
        ? React.createElement("p", null, "Đang upload...")
        : null,

      error
        ? React.createElement(
            "p",
            { style: { color: "red" } },
            error
          )
        : null,

      props.value
        ? React.createElement("img", {
            src: props.value,
            alt: "Ảnh đã upload",
            style: {
              display: "block",
              width: "100%",
              maxWidth: "400px",
              height: "220px",
              objectFit: "cover",
              marginTop: "12px",
              borderRadius: "8px",
            },
          })
        : null
    );
  }

  function SupabaseImagePreview(props) {
    if (!props.value) {
      return window.React.createElement("p", null, "Chưa có ảnh");
    }

    return window.React.createElement("img", {
      src: props.value,
      alt: "Preview",
      style: {
        maxWidth: "100%",
        height: "auto",
      },
    });
  }

  window.CMS.registerWidget(
    "supabase-image",
    SupabaseImageControl,
    SupabaseImagePreview
  );
})();