import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ valid: false });
  }

  const { data, error } = await supabase
    .from("pro_users")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return Response.json({ valid: false });
  }

  return Response.json({ valid: true });
}
