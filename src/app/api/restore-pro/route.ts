import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const { data } = await supabase
      .from("pro_users")
      .select("token")
      .eq("email", email)
      .single();

    if (!data) {
      return NextResponse.json({ ok: false });
    }

    return NextResponse.json({ ok: true, token: data.token });
  } catch (err) {
    console.error("RESTORE ERROR:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
