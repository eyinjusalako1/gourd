import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId as string | undefined;

    if (!userId) {
      return NextResponse.json(
        { error: "Missing userId" },
        { status: 400 }
      );
    }

    // Query without .single() to avoid relationship resolution issues
    const { data, error } = await supabaseServer
      .from("user_profiles")
      .select("*")
      .eq("id", userId)
      .limit(1);

    if (error) {
      console.error("Get profile error:", error);
      return NextResponse.json(
        { error: "Failed to fetch profile", details: error.message },
        { status: 500 }
      );
    }

    // Return first result or null
    const profile = data && data.length > 0 ? data[0] : null;

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (err: any) {
    console.error("Unexpected get-profile error:", err);
    return NextResponse.json(
      { error: "Unexpected error fetching profile", details: err.message },
      { status: 500 }
    );
  }
}



