import fs from "node:fs";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error("Thiếu biến môi trường Supabase");
}

const content = `
window.SUPABASE_URL = ${JSON.stringify(url)};
window.SUPABASE_ANON_KEY = ${JSON.stringify(key)};
window.SUPABASE_BUCKET = "game-images";
`;

fs.writeFileSync("public/admin/supabase-config.js", content.trim());