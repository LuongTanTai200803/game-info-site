(function () {
  const SUPABASE_URL = "https://vvhyysizqdlmmsfxzled.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2aHl5c2l6cWRsbW1zZnh6bGVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2OTcyNzQsImV4cCI6MjA5OTI3MzI3NH0.23oj2ohpLyGlVsUwooqmrTrFx7zXHpr8zFfNzGxAUb0";
  const BUCKET_NAME = "game-images";

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
  );

  function SupabaseImageControl(props) {
    const React = window.React;
    const [uploading, setUploading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");

    const value = props.value || "";

    async function handleUpload(event) {
      const file = event.target.files?.[0];

      if (!file) {
        return;
      }

      setErrorMessage("");

      if (!file.type.startsWith("image/")) {
        setErrorMessage("Chỉ được upload file ảnh.");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage("Ảnh không được lớn hơn 5 MB.");
        return;
      }

      setUploading(true);

      try {
        const extension = file.name.split(".").pop() || "jpg";
        const safeName = crypto.randomUUID();
        const filePath = `posts/${Date.now()}-${safeName}.${extension}`;

        const { error: uploadError } = await supabaseClient.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabaseClient.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        if (!data?.publicUrl) {
          throw new Error("Không lấy được URL ảnh.");
        }

        props.onChange(data.publicUrl);
      } catch (error) {
        console.error(error);

        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Upload ảnh thất bại."
        );
      } finally {
        setUploading(false);
        event.target.value = "";
      }
    }

    function handleRemove() {
      props.onChange("");
    }

    return React.createElement(
      "div",
      {
        style: {
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        },
      },

      React.createElement("input", {
        type: "file",
        accept: "image/*",
        disabled: uploading,
        onChange: handleUpload,
      }),

      uploading
        ? React.createElement("p", null, "Đang upload ảnh...")
        : null,

      errorMessage
        ? React.createElement(
            "p",
            {
              style: {
                color: "red",
              },
            },
            errorMessage
          )
        : null,

      value
        ? React.createElement(
            React.Fragment,
            null,

            React.createElement("img", {
              src: value,
              alt: "Ảnh đã upload",
              style: {
                width: "100%",
                maxWidth: "400px",
                height: "220px",
                objectFit: "cover",
                borderRadius: "8px",
              },
            }),

            React.createElement(
              "a",
              {
                href: value,
                target: "_blank",
                rel: "noreferrer",
              },
              "Mở ảnh"
            ),

            React.createElement(
              "button",
              {
                type: "button",
                onClick: handleRemove,
                style: {
                  width: "fit-content",
                  padding: "8px 12px",
                  cursor: "pointer",
                },
              },
              "Xóa ảnh khỏi bài viết"
            )
          )
        : null
    );
  }

  function SupabaseImagePreview(props) {
    const React = window.React;
    const value = props.value;

    if (!value) {
      return React.createElement("p", null, "Chưa có ảnh");
    }

    return React.createElement("img", {
      src: value,
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