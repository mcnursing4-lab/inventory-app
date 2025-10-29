iimport { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const defaultOrgId = process.env.NEXT_PUBLIC_DEFAULT_ORG_ID;

export default async function Home() {
  // 🧩 Log environment values on the server (will appear in Vercel logs)
  console.log("✅ Supabase URL:", supabaseUrl);
  console.log("✅ Default Org ID:", defaultOrgId);

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
