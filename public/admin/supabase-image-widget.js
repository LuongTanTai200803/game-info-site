import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

(function () {
  const h = window.h;
  const createClass = window.createClass;

  if (!window.CMS || !h || !createClass) {
    console.error("Decap CMS globals are not available.");
    return;
  }

  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY || !window.SUPABASE_BUCKET) {
    console.error("Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_BUCKET.");
    return;
  }

  const client = createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);

  const SupabaseImageControl = createClass({
    getInitialState() {
      return {
        uploading: false,
        error: "",
      };
    },

    async handleUpload(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      this.setState({ uploading: true, error: "" });

      try {
        if (!file.type.startsWith("image/")) {
          throw new Error("Chỉ được chọn file ảnh");
        }

        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const filePath = "posts/" + Date.now() + "-" + crypto.randomUUID() + "." + extension;

        const { error: uploadError } = await client.storage
          .from(window.SUPABASE_BUCKET)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data } = client.storage
          .from(window.SUPABASE_BUCKET)
          .getPublicUrl(filePath);

        if (!data || !data.publicUrl) {
          throw new Error("Không lấy được URL ảnh");
        }

        this.props.onChange(data.publicUrl);
      } catch (err) {
        console.error(err);
        this.setState({
          error: err instanceof Error ? err.message : "Upload thất bại",
        });
      } finally {
        this.setState({ uploading: false });
        event.target.value = "";
      }
    },

    render() {
      const uploading = this.state.uploading;
      const error = this.state.error;
      const value = this.props.value;

      return h("div", {}, [
        h("input", {
          type: "file",
          accept: "image/*",
          disabled: uploading,
          onChange: this.handleUpload.bind(this),
        }),

        uploading ? h("p", {}, "Đang upload...") : null,

        error ? h("p", { style: { color: "red" } }, error) : null,

        value
          ? h("img", {
              src: value,
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
          : null,
      ]);
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
          maxWidth: "100%",
          height: "auto",
        },
      });
    },
  });

  window.CMS.registerWidget("supabase-image", SupabaseImageControl, SupabaseImagePreview);
})();